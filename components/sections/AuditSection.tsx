"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader } from "@/components/ui/loader";
import {
  Search,
  AlertTriangle,
  Download,
  RefreshCw,
  Mail,
} from "lucide-react";

interface AuditResult {
  score: number;
  riskLevel?: "critical" | "high" | "medium" | "low";
  scanTime: number;
  results: Record<string, boolean>;
  recommendations?: string[];
  missing?: string[];
  details?: {
    trackersDetected?: boolean;
    consentBannerDetected?: boolean;
  };
}

export function AuditSection() {
  const t = useTranslations("audit");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Basic URL validation
    if (!url.trim()) {
      setError(t("error.invalidUrl"));
      return;
    }

    let validUrl = url.trim();
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }

    try {
      new URL(validUrl);
    } catch {
      setError(t("error.invalidUrl"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validUrl }),
      });

      if (!response.ok) {
        throw new Error("Scan failed");
      }

      const data = await response.json();
      setResult(data);
    } catch {
      setError(t("error.failed"));
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelFromScore = (score: number) => {
    if (score < 40) return "critical";
    if (score < 60) return "high";
    if (score < 80) return "medium";
    return "low";
  };

  const resetAudit = () => {
    setUrl("");
    setResult(null);
    setError(null);
  };

  const criteriaTotal = 4;
  const criteriaKeys = [
    "privacyPolicy",
    "https",
    "cookieConsent",
    "responsiblePerson",
  ] as const;

  const passedCriteria = result
    ? criteriaKeys.filter((key) => result.results?.[key]).length
    : 0;
  const percentScore = Math.round((passedCriteria / criteriaTotal) * 100);

  const resolvedRiskLevel = result
    ? result.riskLevel ?? getRiskLevelFromScore(percentScore)
    : "low";

  const recommendations = result
    ? result.missing?.map((key) => t(`recommendationMessages.${key}`)) ??
      result.recommendations ??
      []
    : [];

  const contactHref = (auditType: string) =>
    `?auditType=${encodeURIComponent(auditType)}#contact`;

  const riskClasses = {
    critical: { text: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700" },
    high: { text: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
    medium: { text: "text-yellow-600", bg: "bg-yellow-50", badge: "bg-yellow-100 text-yellow-700" },
    low: { text: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700" },
  } as const;

  const scoreLabel = t("results.scoreLabel", {
    passed: passedCriteria,
    total: criteriaTotal,
    percent: percentScore,
  });

  const ctaCopy = t.raw("resultsCta") as {
    needsHelp: string;
    report: string;
    fixAll: string;
    recommended: string;
    congrats: string;
    maintain: string;
  };

  return (
    <section id="audit" className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("sectionTitle")}
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-10"
            >
              <Card className="glass">
                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={t("placeholder")}
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pl-12"
                          disabled={isLoading}
                        />
                      </div>
                      <Button type="submit" disabled={isLoading} size="lg">
                        {isLoading ? (
                          <Loader size="sm" />
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            {t("button")}
                          </>
                        )}
                      </Button>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-sm text-red-400"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                      </motion.p>
                    )}

                    {isLoading && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm text-muted-foreground"
                      >
                        {t("scanning")}
                      </motion.p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-10 space-y-6"
            >
              {/* Score Header */}
              <div
                className={`rounded-lg border border-border p-6 text-center ${riskClasses[resolvedRiskLevel].bg}`}
              >
                <h2 className="text-3xl font-bold text-slate-900">
                  {passedCriteria}/{criteriaTotal}
                </h2>
                <p className={`${riskClasses[resolvedRiskLevel].text} mt-2`}>
                  {scoreLabel}
                </p>
                <span
                  className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${riskClasses[resolvedRiskLevel].badge}`}
                >
                  {t(`riskLevels.${resolvedRiskLevel}`)}
                </span>
              </div>

              {/* Criteria Results */}
              <div className="space-y-4">
                {criteriaKeys.map((key) => {
                  const passed = Boolean(result.results?.[key]);
                  const trackersDetected = Boolean(result.details?.trackersDetected);

                  let title = "";
                  let description = "";
                  let action = "";
                  let extra = "";

                  if (key === "privacyPolicy") {
                    if (passed) {
                      title = t("criteriaDetails.privacyPolicy.pass.title");
                      description = t(
                        "criteriaDetails.privacyPolicy.pass.description",
                      );
                    } else {
                      title = t("criteriaDetails.privacyPolicy.fail.title");
                      description = t(
                        "criteriaDetails.privacyPolicy.fail.description",
                      );
                      action = t("criteriaDetails.privacyPolicy.fail.action");
                    }
                  }

                  if (key === "https") {
                    if (passed) {
                      title = t("criteriaDetails.https.pass.title");
                      description = t("criteriaDetails.https.pass.description");
                    } else {
                      title = t("criteriaDetails.https.fail.title");
                      description = t("criteriaDetails.https.fail.description");
                      action = t("criteriaDetails.https.fail.action");
                    }
                  }

                  if (key === "cookieConsent") {
                    if (passed) {
                      title = t("criteriaDetails.cookieConsent.pass.title");
                      if (!trackersDetected) {
                        description = t(
                          "criteriaDetails.cookieConsent.pass.noTrackersDescription",
                        );
                      } else {
                        description = t(
                          "criteriaDetails.cookieConsent.pass.withBannerDescription",
                        );
                      }
                    } else {
                      const trackersList = "Google Analytics, Facebook Pixel";
                      title = t("criteriaDetails.cookieConsent.fail.title");
                      description = t(
                        "criteriaDetails.cookieConsent.fail.description",
                      );
                      action = t("criteriaDetails.cookieConsent.fail.action");
                      extra = t("criteriaDetails.cookieConsent.fail.extra", {
                        trackers: trackersList,
                      });
                    }
                  }

                  if (key === "responsiblePerson") {
                    if (passed) {
                      title = t("criteriaDetails.responsiblePerson.pass.title");
                      description = t(
                        "criteriaDetails.responsiblePerson.pass.description",
                      );
                    } else {
                      title = t("criteriaDetails.responsiblePerson.fail.title");
                      description = t(
                        "criteriaDetails.responsiblePerson.fail.description",
                      );
                      action = t("criteriaDetails.responsiblePerson.fail.action");
                    }
                  }

                  return (
                    <div
                      key={key}
                      className={`flex items-start gap-4 rounded-lg border p-4 ${
                        passed
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >
                      <div
                        className={`text-2xl ${
                          passed ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {passed ? "✅" : "❌"}
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold ${
                            passed ? "text-green-700" : "text-red-700"
                          }`}
                        >
                          {title}
                        </h3>
                        <p
                          className={`mt-1 text-sm ${
                            passed ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {description}
                        </p>
                        {extra && (
                          <p className="mt-1 text-xs text-red-600">{extra}</p>
                        )}
                        {action && (
                          <button className="mt-2 text-sm text-red-600 underline">
                            {action}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recommendations */}
              {recommendations.length > 0 && (
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-xl">
                      {t("recommendations")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {recommendations.map((rec, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-muted-foreground"
                        >
                          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-400" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* CTA After Results */}
              {percentScore < 100 ? (
                <div className="rounded-lg border border-border bg-slate-50 p-6">
                  <h3 className="mb-4 font-bold text-slate-900">
                    {ctaCopy.needsHelp}
                  </h3>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button asChild variant="outline" className="w-full">
                      <a href={contactHref("scanOnly")}>{ctaCopy.report}</a>
                    </Button>
                    <div className="relative w-full">
                      <div className="absolute -top-3 right-3">
                        <Badge variant="success">{ctaCopy.recommended}</Badge>
                      </div>
                      <Button asChild className="w-full gradient-primary">
                        <a href={contactHref("scanFix")}>{ctaCopy.fixAll}</a>
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-slate-50 p-6">
                  <h3 className="mb-4 font-bold text-slate-900">
                    {ctaCopy.congrats}
                  </h3>
                  <Button asChild className="gradient-primary">
                    <a href={contactHref("complianceManager")}>
                      {ctaCopy.maintain}
                    </a>
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" asChild>
                  <a href="#contact">
                    <Mail className="h-4 w-4" />
                    {t("cta.fullAudit")}
                  </a>
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="h-4 w-4" />
                  {t("cta.download")}
                </Button>
                <Button variant="ghost" size="lg" onClick={resetAudit}>
                  <RefreshCw className="h-4 w-4" />
                  {t("cta.scanAnother")}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
