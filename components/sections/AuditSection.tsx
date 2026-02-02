"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Search, AlertTriangle, RefreshCw } from "lucide-react";

interface AuditCheck {
  id: string;
  name: string;
  passed: boolean;
  icon: string;
  description: string;
  warning: string | null;
}

interface AuditRating {
  level: "CRITIQUE" | "À AMÉLIORER" | "PASSABLE" | "BIEN";
  color: string;
  emoji: string;
  message: string;
}

interface AuditResult {
  success: boolean;
  url: string;
  rating: AuditRating;
  checks: AuditCheck[];
  passedCount: number;
  totalChecks: number;
  notTested: string[];
  scannedAt: string;
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

  const resetAudit = () => {
    setUrl("");
    setResult(null);
    setError(null);
  };

  const needsHelp =
    result?.rating.level === "CRITIQUE" ||
    result?.rating.level === "À AMÉLIORER";

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
              className="mt-10 space-y-8"
            >
              <div className="text-center p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700">
                <div className="text-6xl mb-4">{result.rating.emoji}</div>
                <h2
                  className="text-3xl font-bold mb-3"
                  style={{ color: result.rating.color }}
                >
                  {result.rating.level}
                </h2>
                <p className="text-slate-300 max-w-2xl mx-auto">
                  {result.rating.message}
                </p>
              </div>

              <div className="space-y-4 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Ce qui a été vérifié (4 critères de base)
                </h3>

                {result.checks.map((check) => (
                  <div
                    key={check.id}
                    className={`p-6 rounded-lg border-2 ${
                      check.passed
                        ? "bg-green-50 border-green-500"
                        : "bg-red-50 border-red-500"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{check.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-2xl ${
                              check.passed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {check.passed ? "\u2705" : "\u274C"}
                          </span>
                          <h4 className="font-semibold text-lg text-slate-900">
                            {check.name}
                          </h4>
                        </div>
                        <p className="text-slate-700 mb-2">
                          {check.description}
                        </p>
                        {check.warning && (
                          <p className="text-slate-600 text-sm italic bg-slate-100 p-3 rounded">
                            {check.warning}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-8 bg-amber-50 border-2 border-amber-500 rounded-xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{"\u26A0\uFE0F"}</span>
                  <h3 className="text-2xl font-bold text-amber-900">
                    8 CRITÈRES CRITIQUES NON VÉRIFIÉS
                  </h3>
                </div>

                <p className="text-amber-900 mb-6 font-medium">
                  Ce scan gratuit vérifie uniquement la PRÉSENCE d'éléments de
                  base. Les critères suivants ne sont PAS analysés:
                </p>

                <div className="grid md:grid-cols-2 gap-3">
                  {result.notTested.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 text-amber-900"
                    >
                      <span className="text-xl mt-0.5">{"\u2753"}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-white rounded-lg border border-amber-300">
                  <p className="text-sm text-amber-900">
                    <strong>{"\u{1F4CB}"} Le scan complet</strong> analyse ces 8
                    critères supplémentaires + le CONTENU détaillé de votre
                    politique de confidentialité avec validation IA.
                  </p>
                </div>
              </div>

              {needsHelp ? (
                <div className="mt-12 p-8 bg-red-50 border-2 border-red-500 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{"\u{1F6A8}"}</span>
                    <h3 className="text-2xl font-bold text-red-900">
                      PROCHAINES ÉTAPES RECOMMANDÉES
                    </h3>
                  </div>

                  <p className="text-red-900 mb-6">
                    Votre site nécessite des correctifs pour assurer la
                    conformité Loi 25.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg border-2 border-violet-500">
                      <h4 className="font-bold text-lg mb-2">Scan Complet</h4>
                      <p className="text-3xl font-bold text-violet-600 mb-3">
                        199$
                      </p>
                      <ul className="text-sm space-y-1 mb-4">
                        <li>{"\u2713"} Analyse des 12 critères</li>
                        <li>{"\u2713"} Rapport PDF détaillé</li>
                        <li>{"\u2713"} Plan d'action priorisé</li>
                        <li>{"\u2713"} Guide de corrections</li>
                      </ul>
                      <a
                        href="#contact"
                        className="block w-full text-center bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700"
                      >
                        Obtenir le scan complet
                      </a>
                    </div>

                    <div className="bg-gradient-to-br from-violet-600 to-purple-600 text-white p-6 rounded-lg border-2 border-purple-700 relative">
                      <div className="absolute -top-3 -right-3 bg-yellow-400 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">
                        {"\u2B50"} POPULAIRE
                      </div>
                      <h4 className="font-bold text-lg mb-2">
                        Scan + Corrections
                      </h4>
                      <p className="text-3xl font-bold mb-3">699$</p>
                      <ul className="text-sm space-y-1 mb-4">
                        <li>{"\u2713"} Tout inclus dans Scan Complet</li>
                        <li>{"\u2713"} Nous corrigeons TOUT pour vous</li>
                        <li>{"\u2713"} Certificat de conformité</li>
                        <li>{"\u2713"} Support 30 jours</li>
                      </ul>
                      <a
                        href="#contact"
                        className="block w-full text-center bg-white text-purple-700 py-3 rounded-lg font-semibold hover:bg-slate-100"
                      >
                        On corrige tout pour vous
                      </a>
                    </div>
                  </div>

                  <p className="text-center mt-6 text-red-900 font-semibold">
                    {"\u{1F525}"} Offre de lancement: 50% de rabais pour les 5
                    premiers clients
                  </p>
                </div>
              ) : (
                <div className="mt-12 p-8 bg-green-50 border-2 border-green-500 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{"\u2705"}</span>
                    <h3 className="text-2xl font-bold text-green-900">
                      BONNE NOUVELLE!
                    </h3>
                  </div>

                  <p className="text-green-900 mb-4">
                    Votre site a les éléments de base en place.
                  </p>

                  <div className="bg-amber-100 border border-amber-400 rounded-lg p-6 mb-6">
                    <p className="text-amber-900 font-semibold mb-3">
                      {"\u26A0\uFE0F"} MAIS attention: Ce scan gratuit ne vérifie
                      que 4 critères sur 12.
                    </p>
                    <p className="text-amber-900 text-sm mb-2">
                      <strong>RISQUES NON VÉRIFIÉS:</strong>
                    </p>
                    <ul className="text-amber-900 text-sm space-y-1">
                      <li>
                        {"\u2022"} Contenu de votre politique (conforme Loi 25?)
                      </li>
                      <li>
                        {"\u2022"} Droits des utilisateurs (correctement
                        documentés?)
                      </li>
                      <li>
                        {"\u2022"} Gestion des formulaires (consentement valide?)
                      </li>
                      <li>
                        {"\u2022"} Cookies tiers (activés sans permission?)
                      </li>
                      <li>{"\u2022"} Et 4 autres critères critiques...</li>
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-lg border-2 border-violet-500">
                    <h4 className="font-bold text-lg mb-2">
                      Obtenez la certification complète
                    </h4>
                    <p className="text-violet-600 text-2xl font-bold mb-3">
                      À partir de 199$
                    </p>
                    <p className="text-slate-700 mb-4">
                      Assurez-vous à 100% d'être conforme avec notre scan
                      complet qui analyse les 12 critères + génère votre
                      certificat officiel.
                    </p>
                    <ul className="text-sm space-y-1 mb-4">
                      <li>{"\u2713"} Rapport détaillé PDF avec screenshots</li>
                      <li>
                        {"\u2713"} Plan d'action si correctifs nécessaires
                      </li>
                      <li>{"\u2713"} Certificat de conformité (si 100%)</li>
                    </ul>
                    <a
                      href="#contact"
                      className="block w-full text-center bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700"
                    >
                      Obtenir le scan complet - 199$
                    </a>
                  </div>
                </div>
              )}

              <div className="flex justify-center">
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
