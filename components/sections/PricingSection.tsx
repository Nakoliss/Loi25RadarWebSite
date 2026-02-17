"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Sparkles,
  Shield,
  Eye,
  Plus,
  AlertCircle,
  Info,
} from "lucide-react";
import { useState } from "react";
import { PreCheckoutModal } from "@/components/PreCheckoutModal";

export function PricingSection() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const tiers = [
    {
      key: "scanOnly",
      name: t("tiers.scanOnly.name"),
      price: t("tiers.scanOnly.price"),
      period: t("tiers.scanOnly.period"),
      description: t("tiers.scanOnly.description"),
      features: t.raw("tiers.scanOnly.features") as string[],
      cta: t("tiers.scanOnly.cta"),
      icon: Eye,
      variant: "outline" as const,
      isDirectPay: true,
    },
    {
      key: "scanFix",
      name: t("tiers.scanFix.name"),
      price: t("tiers.scanFix.price"),
      period: t("tiers.scanFix.period"),
      description: t("tiers.scanFix.description"),
      features: t.raw("tiers.scanFix.features") as string[],
      cta: t("tiers.scanFix.cta"),
      popular: true,
      icon: Sparkles,
      variant: "default" as const,
      isDirectPay: true,
    },
    {
      key: "complianceManager",
      name: t("tiers.complianceManager.name"),
      price: t("tiers.complianceManager.price"),
      period: t("tiers.complianceManager.period"),
      description: t("tiers.complianceManager.description"),
      features: t.raw("tiers.complianceManager.features") as string[],
      cta: t("tiers.complianceManager.cta"),
      icon: Shield,
      variant: "default" as const,
      isDirectPay: true,
    },
  ];

  const addons = t.raw("addons.items") as Array<{
    name: string;
    description?: string;
    price: string;
  }>;

  return (
    <section id="pricing" className="bg-card/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t("subtitle")}
          </p>
          <p className="mt-2 text-sm text-primary">
            ✅ {t("platforms")} : {t("platformsList")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
            <p className="text-sm text-muted-foreground">⏱️ {t("delay")}</p>
          </div>
        </motion.div>

        {/* Main Tiers */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch justify-items-center max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative flex h-full flex-col"
            >
              {tier.popular && (
                <div className="absolute -top-3 right-4 z-10">
                  <Badge variant="success" className="shadow-lg">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {t("recommendedBadge")}
                  </Badge>
                </div>
              )}
              <Card
                className={`flex h-full flex-col ${
                  tier.popular
                    ? "border-primary/50 bg-gradient-to-b from-primary/10 to-transparent"
                    : ""
                }`}
                glow={tier.popular ? "emerald" : "none"}
              >
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                    <tier.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{tier.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      {locale === "fr" ? (
                        <>
                          {tier.price}
                          {t("currency")}
                        </>
                      ) : (
                        <>
                          {t("currency")}
                          {tier.price}
                        </>
                      )}
                    </span>
                    {tier.period && (
                      <span className="ml-1 text-sm text-muted-foreground">
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <ul className="mb-6 flex-1 space-y-3">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {tier.key === "scanOnly" && (
                    <div className="mb-6 p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-[11px] leading-relaxed text-primary italic flex gap-2">
                        <Info className="h-4 w-4 shrink-0" />
                        {t("scanCreditNote")}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto pt-4">
                    <Button
                      variant={tier.popular ? "default" : tier.variant}
                      className={`w-full ${tier.popular ? "gradient-primary" : ""}`}
                      onClick={() => {
                        if (tier.isDirectPay) {
                          setSelectedPlan({ id: tier.key, name: tier.name });
                        }
                      }}
                    >
                      {tier.cta}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground mt-2 opacity-60">
                      💳 Paiement sécurisé via Stripe
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add-ons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 sm:mt-32"
        >
          <h3 className="mb-6 text-center text-xl font-semibold text-white">
            <Plus className="mr-2 inline-block h-5 w-5 text-primary" />
            {t("addons.title")}
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {addons.map((addon, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-4"
              >
                <div>
                  <p className="font-medium text-white">{addon.name}</p>
                  {addon.description && (
                    <p className="text-sm text-muted-foreground">
                      {addon.description}
                    </p>
                  )}
                </div>
                <span className="text-sm font-semibold text-primary">
                  {addon.price}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Note & Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center max-w-3xl mx-auto px-4"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            <AlertCircle className="mr-2 inline-block h-4 w-4 text-emerald-400" />
            {t("note")}
          </p>
          <p className="mt-4 text-xs text-muted-foreground opacity-70">
            {t("disclaimer")}
          </p>

          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Besoin d&apos;une solution sur mesure ou d&apos;un devis ?
              <a
                href="#contact"
                className="text-primary hover:underline ml-1 font-medium"
              >
                Contactez-nous
              </a>
            </p>
          </div>
        </motion.div>
      </div>

      <PreCheckoutModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planId={selectedPlan?.id || ""}
        planName={selectedPlan?.name || ""}
      />
    </section>
  );
}
