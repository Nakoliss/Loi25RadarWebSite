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
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Mail,
  Shield,
  Lock,
  Cookie,
  FormInput,
  FileText,
  UserCheck,
} from "lucide-react";

interface AuditResult {
  score: number;
  riskLevel?: "critical" | "high" | "medium" | "low";
  scanTime: number;
  results: Record<string, boolean>;
  recommendations?: string[];
  missing?: string[];
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

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "error";
      case "high":
        return "warning";
      case "medium":
        return "secondary";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getRiskLevelFromScore = (score: number) => {
    if (score < 40) return "critical";
    if (score < 60) return "high";
    if (score < 80) return "medium";
    return "low";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const criteriaIcons = {
    privacyPolicy: FileText,
    https: Lock,
    trackers: Cookie,
    consentBanner: Shield,
    secureForms: FormInput,
    responsiblePerson: UserCheck,
  };

  const resetAudit = () => {
    setUrl("");
    setResult(null);
    setError(null);
  };

  const resolvedRiskLevel = result
    ? result.riskLevel ?? getRiskLevelFromScore(result.score)
    : "low";

  const recommendations = result
    ? result.missing?.map((key) => t(`recommendationMessages.${key}`)) ??
      result.recommendations ??
      []
    : [];

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
              {/* Score Card */}
              <Card className="glass" glow="emerald">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
                    {/* Score */}
                    <div className="text-center sm:text-left">
                      <p className="text-sm text-muted-foreground">
                        {t("score")}
                      </p>
                      <p
                        className={`text-6xl font-bold ${getScoreColor(result.score)}`}
                      >
                        {result.score}
                        <span className="text-2xl text-muted-foreground">
                          /100
                        </span>
                      </p>
                    </div>

                    {/* Risk Level */}
                    <div className="text-center">
                      <p className="mb-2 text-sm text-muted-foreground">
                        {t("riskLevel")}
                      </p>
                      <Badge
                        variant={
                          getRiskColor(resolvedRiskLevel) as
                            | "success"
                            | "warning"
                            | "error"
                            | "secondary"
                            | "default"
                        }
                        className="text-lg px-4 py-2"
                      >
                        {t(`riskLevels.${resolvedRiskLevel}`)}
                      </Badge>
                    </div>

                    {/* Scan Info */}
                    <div className="text-center sm:text-right">
                      <p className="text-sm text-muted-foreground">
                        {t("scanTime")}
                      </p>
                      <p className="text-2xl font-semibold text-white">
                        {result.scanTime}
                        <span className="text-sm text-muted-foreground ml-1">
                          {t("seconds")}
                        </span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Criteria Results */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-xl">Résultats détaillés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(result.results).map(([key, value]) => {
                      const Icon =
                        criteriaIcons[key as keyof typeof criteriaIcons] ??
                        AlertTriangle;
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-3 rounded-lg border p-4 ${
                            value
                              ? "border-green-500/30 bg-green-500/10"
                              : "border-red-500/30 bg-red-500/10"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${value ? "text-green-400" : "text-red-400"}`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {t(`criteria.${key}`)}
                            </p>
                          </div>
                          {value ? (
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

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
