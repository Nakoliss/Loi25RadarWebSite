import { chromium, Browser, Page } from 'playwright';
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const auditSchema = z.object({
    url: z.string().url(),
});

// Known tracker domains and patterns
const TRACKER_DOMAINS = [
    'google-analytics.com',
    'googletagmanager.com',
    'facebook.com',
    'doubleclick.net',
    'googlesyndication.com',
    'amazon-adsystem.com',
    'adsystem.amazon.com',
    'hotjar.com',
    'mixpanel.com',
    'segment.com',
    'intercom.io',
    'zendesk.com',
    'hubspot.com'
];

// Privacy policy indicators
const PRIVACY_INDICATORS = [
    'privacy policy',
    'politique de confidentialité',
    'privacy',
    'confidentialité',
    'données personnelles',
    'personal data',
    'rgpd',
    'gdpr'
];

// Consent banner selectors
const CONSENT_SELECTORS = [
    '[class*="cookie"]',
    '[class*="consent"]',
    '[id*="cookie"]',
    '[id*="consent"]',
    '[class*="gdpr"]',
    '[class*="privacy"]',
    'div:has-text("cookie")',
    'div:has-text("consent")',
    'div:has-text("accepter")',
    'div:has-text("accept")'
];

interface ScanResult {
    score: number;
    riskLevel: "critical" | "high" | "medium" | "low";
    scanTime: number;
    results: {
        privacyPolicy: boolean;
        https: boolean;
        trackers: boolean;
        consentBanner: boolean;
        secureForms: boolean;
    };
    recommendations: string[];
    details: {
        trackersFound: string[];
        privacyPolicyUrl?: string;
        consentBannerText?: string;
        formsAnalyzed: number;
        securityHeaders: string[];
    };
}

class ProductionScanner {
    private browser: Browser | null = null;

    async initialize() {
        if (!this.browser) {
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async scanSite(url: string): Promise<ScanResult> {
        const startTime = Date.now();
        await this.initialize();

        const page = await this.browser!.newPage();
        const trackersFound: string[] = [];
        const securityHeaders: string[] = [];

        try {
            // Monitor network requests for trackers
            page.on('request', (request) => {
                const requestUrl = request.url();
                TRACKER_DOMAINS.forEach(domain => {
                    if (requestUrl.includes(domain)) {
                        trackersFound.push(domain);
                    }
                });
            });

            // Navigate to the site
            const response = await page.goto(url, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            if (!response) {
                throw new Error('Failed to load page');
            }

            // Check security headers
            const headers = response.headers();
            const importantHeaders = [
                'strict-transport-security',
                'content-security-policy',
                'x-frame-options',
                'x-content-type-options'
            ];

            importantHeaders.forEach(header => {
                if (headers[header]) {
                    securityHeaders.push(header);
                }
            });

            // Check HTTPS
            const https = url.startsWith('https://');

            // Check for privacy policy
            const privacyResult = await this.checkPrivacyPolicy(page);

            // Check for consent banner
            const consentResult = await this.checkConsentBanner(page);

            // Check forms
            const formsResult = await this.checkSecureForms(page);

            // Calculate results
            const results = {
                privacyPolicy: privacyResult.found,
                https,
                trackers: trackersFound.length > 0,
                consentBanner: consentResult.found,
                secureForms: formsResult.secure
            };

            // Calculate score
            let score = 0;
            if (results.privacyPolicy) score += 20;
            if (results.https) score += 20;
            if (!results.trackers || results.consentBanner) score += 20;
            if (results.consentBanner) score += 20;
            if (results.secureForms) score += 20;

            // Determine risk level
            let riskLevel: "critical" | "high" | "medium" | "low";
            if (score < 40) riskLevel = "critical";
            else if (score < 60) riskLevel = "high";
            else if (score < 80) riskLevel = "medium";
            else riskLevel = "low";

            // Generate recommendations
            const recommendations = this.generateRecommendations(results, {
                hasTrackers: trackersFound.length > 0,
                hasSecurityHeaders: securityHeaders.length > 0
            });

            const scanTime = Math.round((Date.now() - startTime) / 1000);

            return {
                score,
                riskLevel,
                scanTime,
                results,
                recommendations,
                details: {
                    trackersFound: [...new Set(trackersFound)],
                    privacyPolicyUrl: privacyResult.url,
                    consentBannerText: consentResult.text,
                    formsAnalyzed: formsResult.count,
                    securityHeaders
                }
            };

        } finally {
            await page.close();
        }
    }

    private async checkPrivacyPolicy(page: Page) {
        try {
            // Look for privacy policy links
            const links = await page.$$eval('a', (anchors) =>
                anchors.map(a => ({
                    href: a.href,
                    text: a.textContent?.toLowerCase() || ''
                }))
            );

            for (const link of links) {
                for (const indicator of PRIVACY_INDICATORS) {
                    if (link.text.includes(indicator.toLowerCase())) {
                        return { found: true, url: link.href };
                    }
                }
            }

            // Check page content for privacy policy
            const pageText = await page.textContent('body');
            if (pageText) {
                for (const indicator of PRIVACY_INDICATORS) {
                    if (pageText.toLowerCase().includes(indicator.toLowerCase())) {
                        return { found: true, url: undefined };
                    }
                }
            }

            return { found: false, url: undefined };
        } catch {
            return { found: false, url: undefined };
        }
    }

    private async checkConsentBanner(page: Page) {
        try {
            for (const selector of CONSENT_SELECTORS) {
                const element = await page.$(selector);
                if (element) {
                    const text = await element.textContent();
                    if (text && text.length > 10) { // Avoid false positives
                        return { found: true, text: text.substring(0, 100) };
                    }
                }
            }
            return { found: false, text: undefined };
        } catch {
            return { found: false, text: undefined };
        }
    }

    private async checkSecureForms(page: Page) {
        try {
            const forms = await page.$$('form');
            let secureCount = 0;

            for (const form of forms) {
                // Check if form has proper consent mechanisms
                const hasCheckbox = await form.$('input[type="checkbox"]');
                const hasConsentText = await form.evaluate(el => {
                    const text = el.textContent?.toLowerCase() || '';
                    return text.includes('consent') ||
                        text.includes('agree') ||
                        text.includes('accepte') ||
                        text.includes('consentement');
                });

                if (hasCheckbox && hasConsentText) {
                    secureCount++;
                }
            }

            return {
                secure: forms.length === 0 || secureCount > 0,
                count: forms.length
            };
        } catch {
            return { secure: false, count: 0 };
        }
    }

    private generateRecommendations(
        results: any,
        context: { hasTrackers: boolean; hasSecurityHeaders: boolean }
    ): string[] {
        const recommendations: string[] = [];

        if (!results.privacyPolicy) {
            recommendations.push(
                "Ajoutez une politique de confidentialité claire et accessible sur votre site."
            );
        }

        if (!results.https) {
            recommendations.push(
                "Activez HTTPS avec un certificat SSL valide pour sécuriser toutes les communications."
            );
        }

        if (context.hasTrackers && !results.consentBanner) {
            recommendations.push(
                "Implémentez une bannière de consentement conforme au RGPD pour vos cookies et trackers."
            );
        }

        if (!results.consentBanner) {
            recommendations.push(
                "Ajoutez un système de gestion du consentement aux cookies."
            );
        }

        if (!results.secureForms) {
            recommendations.push(
                "Assurez-vous que vos formulaires incluent des mécanismes de consentement appropriés."
            );
        }

        if (!context.hasSecurityHeaders) {
            recommendations.push(
                "Configurez les en-têtes de sécurité HTTP (CSP, HSTS, X-Frame-Options)."
            );
        }

        return recommendations.slice(0, 4); // Max 4 recommendations
    }
}

// Singleton scanner instance
const scanner = new ProductionScanner();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const parsed = auditSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: "Invalid URL provided" },
                { status: 400 }
            );
        }

        // Run real scan
        const result = await scanner.scanSite(parsed.data.url);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Audit error:", error);
        return NextResponse.json(
            { error: "Failed to scan domain" },
            { status: 500 }
        );
    }
}

// Cleanup on process exit
process.on('SIGINT', async () => {
    await scanner.cleanup();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await scanner.cleanup();
    process.exit(0);
});