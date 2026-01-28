import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const auditSchema = z.object({
  url: z.string().url(),
});

// Simulated scanner - returns mock results for MVP
// In production, this would use Playwright to actually scan the site
function simulateScan(url: string) {
  // Simulate scanning delay
  const scanTime = Math.floor(Math.random() * 5) + 2; // 2-7 seconds

  // Parse the domain for consistent results based on URL
  const domain = new URL(url).hostname;
  const hash = domain
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Generate deterministic but varied results based on domain
  const results = {
    privacyPolicy: hash % 3 !== 0, // 66% chance detected
    https: url.startsWith("https://"),
    trackers: hash % 2 === 0, // 50% chance detected (this is a "warning" - trackers found)
    consentBanner: hash % 4 !== 0, // 75% chance present
    secureForms: hash % 5 !== 0, // 80% chance detected
  };

  // Calculate score: each criterion is worth 20 points
  // For trackers, having them detected without consent is bad
  let score = 0;
  if (results.privacyPolicy) score += 20;
  if (results.https) score += 20;
  if (!results.trackers || results.consentBanner) score += 20; // Good if no trackers OR has consent
  if (results.consentBanner) score += 20;
  if (results.secureForms) score += 20;

  // Determine risk level
  let riskLevel: "critical" | "high" | "medium" | "low";
  if (score < 40) riskLevel = "critical";
  else if (score < 60) riskLevel = "high";
  else if (score < 80) riskLevel = "medium";
  else riskLevel = "low";

  // Generate recommendations based on results
  const recommendations: string[] = [];
  if (!results.privacyPolicy) {
    recommendations.push(
      "Ajoutez une politique de confidentialité accessible sur votre site.",
    );
  }
  if (!results.https) {
    recommendations.push(
      "Activez HTTPS avec un certificat SSL valide pour sécuriser les données.",
    );
  }
  if (results.trackers && !results.consentBanner) {
    recommendations.push(
      "Implémentez une bannière de consentement pour vos cookies et trackers.",
    );
  }
  if (!results.consentBanner) {
    recommendations.push(
      "Ajoutez un système de gestion du consentement aux cookies.",
    );
  }
  if (!results.secureForms) {
    recommendations.push(
      "Assurez-vous que vos formulaires collectent le consentement approprié.",
    );
  }

  return {
    score,
    riskLevel,
    scanTime,
    results,
    recommendations: recommendations.slice(0, 3), // Max 3 recommendations
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

    // Simulate processing delay (1-3 seconds)
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 2000 + 1000),
    );

    // Run simulated scan
    const result = simulateScan(parsed.data.url);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Audit error:", error);
    return NextResponse.json(
      { error: "Failed to scan domain" },
      { status: 500 },
    );
  }
}
