import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const auditSchema = z.object({
  url: z.string().url(),
});

const MAX_HTML_BYTES = 1_000_000;

const TRACKER_SIGNATURES = [
  "google-analytics.com",
  "googletagmanager.com",
  "gtag/js",
  "connect.facebook.net",
  "facebook.com/tr",
  "facebook.net/tr",
];

const PRIVACY_POLICY_PATTERNS = [
  /politique de confidentialit/i,
  /privacy policy/i,
  /politique de vie priv/i,
];

const PRIVACY_POLICY_PATHS = [
  "/privacy",
  "/confidentialite",
  "/confidentialit",
  "/politique",
  "/privacy-policy",
];

const CONSENT_PATTERNS = [
  /cookie/i,
  /consent/i,
  /banni[eè]re/i,
  /gestion du consentement/i,
  /loi 25/i,
];

const RESPONSIBLE_PERSON_PATTERNS = [
  /responsable/i,
  /protection des renseignements personnels/i,
  /privacy officer/i,
  /\bdpo\b/i,
  /responsable de la protection/i,
];

function containsAnyPattern(content: string, patterns: RegExp[]) {
  return patterns.some((pattern) => pattern.test(content));
}

function hasPrivacyPolicyLink(html: string) {
  if (containsAnyPattern(html, PRIVACY_POLICY_PATTERNS)) {
    return true;
  }

  const linkRegex = /href\s*=\s*["']([^"']+)["']/gi;
  let match = linkRegex.exec(html);
  while (match) {
    const href = match[1].toLowerCase();
    if (PRIVACY_POLICY_PATHS.some((path) => href.includes(path))) {
      return true;
    }
    match = linkRegex.exec(html);
  }

  return false;
}

function hasConsentBanner(html: string) {
  return containsAnyPattern(html, CONSENT_PATTERNS);
}

function hasTrackers(html: string) {
  const lower = html.toLowerCase();
  return TRACKER_SIGNATURES.some((signature) => lower.includes(signature));
}

function hasResponsiblePerson(html: string) {
  return containsAnyPattern(html, RESPONSIBLE_PERSON_PATTERNS);
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
          "Mozilla/5.0 (compatible; Loi25Scanner/1.0; +https://loi25.com)",
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

async function runBasicScan(url: string) {
  const startTime = Date.now();
  const response = await fetchWithTimeout(url, 25000);
  const contentType = response.headers.get("content-type") ?? "";
  const isHtml = contentType.includes("text/html");
  if (!isHtml) {
    throw new Error("Unsupported content type");
  }
  const html = await readHtmlBody(response);
  const finalUrl = response.url || url;

  const results = {
    privacyPolicy: hasPrivacyPolicyLink(html),
    https: new URL(finalUrl).protocol === "https:",
    consentBanner: hasConsentBanner(html),
    trackers: hasTrackers(html),
    responsiblePerson: hasResponsiblePerson(html),
  };

  const score = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  const missing = Object.entries(results)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  const scanTime = Math.max(1, Math.round((Date.now() - startTime) / 1000));

  return {
    score,
    total,
    scanTime,
    results,
    missing,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = auditSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 },
      );
    }

    const normalized = normalizeUrl(parsed.data.url);
    await validatePublicHostname(normalized);
    const result = await runBasicScan(normalized.toString());

    return NextResponse.json(result);
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json(
      { error: "Failed to scan domain" },
      { status: 500 },
    );
  }
}
