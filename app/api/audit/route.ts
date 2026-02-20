import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const auditSchema = z.object({
  url: z.string().url(),
});

const MAX_HTML_BYTES = 1_000_000;

const scanCache = new Map<string, { data: ScanResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

// Rate limiting: max 10 requests per IP per minute
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW = 60 * 1000;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

const PRIVACY_EMAILS = [
  "privacy@",
  "confidentialite@",
  "vie-privee@",
  "vieprivee@",
  "protection@",
  "protectiondesdonnees@",
  "dpo@",
  "dataprotection@",
  "donnees@",
  "rgpd@",
  "responsable@",
  "privacite@",
];

const CONSENT_PATTERNS = [
  /cookie/i,
  /consent/i,
  /banni[e\u00E8]re/i,
  /gestion du consentement/i,
  /loi 25/i,
  /accepter/i,
  /refuser/i,
];

type RatingLevel = "CRITIQUE" | "INSUFFISANT" | "À AMÉLIORER" | "BASES DÉTECTÉES";

interface Rating {
  level: RatingLevel;
  color: string;
  emoji: string;
  message: string;
}

interface CheckResult {
  id: string;
  name: string;
  passed: boolean;
  icon: string;
  description: string;
  warning: string | null;
}

interface ScanResponse {
  success: true;
  url: string;
  rating: Rating;
  checks: CheckResult[];
  passedCount: number;
  totalChecks: number;
  notTested: string[];
  scannedAt: string;
}

function containsAnyPattern(content: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(content));
}

function hasConsentBanner(html: string) {
  return containsAnyPattern(html, CONSENT_PATTERNS);
}

async function checkPrivacyContact(
  url: string,
  html: string,
): Promise<{
  found: boolean;
  email: string | null;
}> {
  const domain = new URL(url).hostname.replace("www.", "");
  const lowerHtml = html.toLowerCase();

  for (const emailPrefix of PRIVACY_EMAILS) {
    const fullEmail = emailPrefix + domain;

    if (lowerHtml.includes(fullEmail.toLowerCase())) {
      return { found: true, email: fullEmail };
    }

    if (lowerHtml.includes(emailPrefix)) {
      return { found: true, email: emailPrefix + domain };
    }
  }

  return { found: false, email: null };
}

async function checkPrivacyPolicy(baseUrl: string): Promise<boolean> {
  const paths = [
    "/privacy",
    "/privacy-policy",
    "/confidentialite",
    "/politique-confidentialite",
    "/politique-de-confidentialite",
    "/vie-privee",
    "/protection-donnees",
    "/fr/privacy",
    "/fr/confidentialite",
    "/en/privacy",
  ];

  for (const path of paths) {
    try {
      const testUrl = new URL(path, baseUrl).href;
      const response = await fetch(testUrl, {
        method: "HEAD",
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return true;
      }
    } catch (error) {
      continue;
    }
  }

  return false;
}

function getQualitativeRating(passedChecks: number): Rating {
  const warningSuffix = " ⚠️ Attention: Ce scan ne couvre que les éléments visibles de base. 8 critères supplémentaires plus approfondis n'ont pas été testés.";

  if (passedChecks <= 1) {
    return {
      level: "CRITIQUE",
      color: "#EF4444",
      emoji: "\u{1F534}",
      message:
        "Votre site présente des lacunes majeures en conformité Loi 25. Action immédiate recommandée pour éviter les risques d'amendes." + warningSuffix,
    };
  }

  if (passedChecks === 2) {
    return {
      level: "INSUFFISANT",
      color: "#F97316",
      emoji: "\u{1F7E0}",
      message:
        "Votre site a quelques éléments de base en place, mais des correctifs importants sont nécessaires pour assurer la conformité complète." + warningSuffix,
    };
  }

  if (passedChecks === 3) {
    return {
      level: "À AMÉLIORER",
      color: "#EAB308",
      emoji: "\u{1F7E1}",
      message:
        "Votre site respecte plusieurs exigences de base, mais certains éléments critiques manquent encore." + warningSuffix,
    };
  }

  return {
    level: "BASES DÉTECTÉES",
    color: "#22C55E",
    emoji: "\u{1F7E2}",
    message:
      "Votre site respecte les 4 critères de base vérifiés." + warningSuffix,
  };
}

function isPrivateIp(ip: string) {
  if (ip === "::1" || ip === "127.0.0.1") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("172.")) {
    const octet = Number(ip.split(".")[1]);
    return octet >= 16 && octet <= 31;
  }
  if (ip.startsWith("169.254.")) return true;
  if (ip.startsWith("fc") || ip.startsWith("fd")) return true;
  return false;
}

async function validatePublicHostname(url: URL) {
  const response = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(url.hostname)}`,
    { headers: { Accept: "application/json" } },
  );
  if (!response.ok) {
    throw new Error("DNS lookup failed");
  }
  const data = (await response.json()) as {
    Answer?: Array<{ type: number; data: string }>;
  };
  const answers = data.Answer ?? [];
  const ipv4s = answers.filter((record) => record.type === 1);
  const ipv6s = answers.filter((record) => record.type === 28);
  const hasBlocked = [...ipv4s, ...ipv6s].some((record) =>
    isPrivateIp(record.data),
  );
  if (hasBlocked || answers.length === 0) {
    throw new Error("Blocked host");
  }
}

function normalizeUrl(input: string) {
  const url = new URL(input);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Unsupported protocol");
  }
  return url;
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Loi25Scanner/1.0; +https://solutionsimpactweb.com)",
      },
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function readHtmlBody(response: Response) {
  const reader = response.body?.getReader();
  if (!reader) {
    return "";
  }

  let received = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.length;
      if (received > MAX_HTML_BYTES) {
        throw new Error("Response too large");
      }
      chunks.push(value);
    }
  }

  const decoder = new TextDecoder("utf-8");
  return decoder.decode(Buffer.concat(chunks));
}

async function runBasicScan(url: string): Promise<ScanResponse> {
  const response = await fetchWithTimeout(url, 25000);
  const contentType = response.headers.get("content-type") ?? "";
  const isHtml = contentType.includes("text/html");
  if (!isHtml) {
    throw new Error("Unsupported content type");
  }
  const html = await readHtmlBody(response);
  const finalUrl = response.url || url;

  const privacyContact = await checkPrivacyContact(finalUrl, html);
  const hasPrivacyPolicy = await checkPrivacyPolicy(finalUrl);
  const hasHttps = finalUrl.startsWith("https://");
  const hasCookieBanner = hasConsentBanner(html);

  const checks: CheckResult[] = [
    {
      id: "https",
      name: "HTTPS Actif",
      passed: hasHttps,
      icon: "\u{1F512}",
      description: hasHttps
        ? "Votre site utilise un certificat SSL valide."
        : "Votre site n'utilise pas HTTPS. C'est obligatoire pour protéger les données transmises.",
      warning: hasHttps
        ? null
        : "Activez un certificat SSL (Let's Encrypt gratuit ou via votre hébergeur).",
    },
    {
      id: "cookie-banner",
      name: "Bannière Consentement Cookies",
      passed: hasCookieBanner,
      icon: "\u{1F36A}",
      description: hasCookieBanner
        ? "Une bannière de gestion des cookies a été détectée."
        : "Aucune bannière de gestion des cookies détectée.",
      warning: hasCookieBanner
        ? null
        : "Obligatoire si vous utilisez Google Analytics, Meta Pixel, GTM, ou tout autre tracker.",
    },
    {
      id: "privacy-policy",
      name: "Politique de Confidentialité",
      passed: hasPrivacyPolicy,
      icon: "\u{1F4C4}",
      description: hasPrivacyPolicy
        ? "Une politique de confidentialité a été trouvée."
        : "Aucune politique de confidentialité détectée.",
      warning: hasPrivacyPolicy
        ? "\u26A0\uFE0F Le CONTENU de votre politique n'a pas été analysé dans ce scan gratuit."
        : "Créez une politique de confidentialité accessible depuis votre site (lien dans le footer).",
    },
    {
      id: "privacy-contact",
      name: "Contact Responsable Protection",
      passed: privacyContact.found,
      icon: "\u{1F4E7}",
      description: privacyContact.found
        ? `Un email de protection des données a été détecté${
            privacyContact.email ? ": " + privacyContact.email : ""
          }.`
        : "Aucun email privacy@, confidentialite@ ou mention de responsable détecté.",
      warning: privacyContact.found
        ? "\u26A0\uFE0F Non vérifié: Le responsable est-il nommé? Les informations sont-elles complètes et dans la politique officielle?"
        : "Créez un email dédié (privacy@votredomaine.com ou confidentialite@votredomaine.com) et nommez un responsable dans votre politique.",
    },
  ];

  const passedCount = checks.filter((check) => check.passed).length;
  const rating = getQualitativeRating(passedCount);

  const notTested = [
    "Votre politique mentionne-t-elle la Loi 25, RGPD ou LPRPDE?",
    "Les droits des utilisateurs sont-ils documentés (accès, suppression, portabilité)?",
    "Votre politique est-elle à jour (moins de 2 ans)?",
    "Les transferts de données sont-ils divulgués (où sont stockées les données)?",
    "Un mécanisme de suppression des données est-il disponible?",
    "Vos formulaires ont-ils des checkboxes de consentement non pré-cochées?",
    "Des cookies tiers sont-ils activés sans consentement préalable?",
    "Votre responsable de protection est-il clairement nommé avec contact complet?",
  ];

  return {
    success: true,
    url: finalUrl,
    rating,
    checks,
    passedCount,
    totalChecks: 4,
    notTested,
    scannedAt: new Date().toISOString(),
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of scanCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      scanCache.delete(key);
    }
  }
}, CACHE_DURATION);

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now - value.windowStart > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before trying again." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }

    const body = await request.json();

    const parsed = auditSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 },
      );
    }

    const normalized = normalizeUrl(parsed.data.url);
    await validatePublicHostname(normalized);
    const normalizedUrl = normalized.toString();
    const cacheKey = `scan:${normalizedUrl}`;
    const cached = scanCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    const result = await runBasicScan(normalizedUrl);

    scanCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json(
      { error: "Failed to scan domain" },
      { status: 500 },
    );
  }
}
