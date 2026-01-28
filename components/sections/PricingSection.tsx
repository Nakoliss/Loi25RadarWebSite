"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Shield, Eye, Plus, AlertCircle } from "lucide-react";

export function PricingSection() {
  const t = useTranslations("pricing");

  const tiers = [
    {
      key: "free",
      name: t("tiers.free.name"),
      price: t("tiers.free.price"),
      period: t("tiers.free.period"),
      description: t("tiers.free.description"),
      features: t.raw("tiers.free.features") as string[],
      cta: t("tiers.free.cta"),
      icon: Eye,
      href: "#audit",
      variant: "outline" as const,
    },
    {
      key: "express",
      name: t("tiers.express.name"),
      price: t("tiers.express.price"),
      period: t("tiers.express.period"),
      description: t("tiers.express.description"),
      features: t.raw("tiers.express.features") as string[],
      cta: t("tiers.express.cta"),
      icon: Shield,
      href: "#contact",
      variant: "default" as const,
    },
    {
      key: "pro",
      name: t("tiers.pro.name"),
      price: t("tiers.pro.price"),
      period: t("tiers.pro.period"),
      description: t("tiers.pro.description"),
      features: t.raw("tiers.pro.features") as string[],
      cta: t("tiers.pro.cta"),
      popular: true,
      icon: Sparkles,
      href: "#contact",
      variant: "default" as const,
    },
    {
      key: "monitoring",
      name: t("tiers.monitoring.name"),
      price: t("tiers.monitoring.price"),
      period: t("tiers.monitoring.period"),
      description: t("tiers.monitoring.description"),
      features: t.raw("tiers.monitoring.features") as string[],
      cta: t("tiers.monitoring.cta"),
      icon: Eye,
      href: "#contact",
      variant: "outline" as const,
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
          <p className="text-sm text-muted-foreground">⏱️ {t("delay")}</p>
        </motion.div>

        {/* Main Tiers */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
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
                <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                  <Badge variant="success" className="shadow-lg">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Recommandé
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
                      {t("currency")}
                      {tier.price}
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
                  <div className="mt-auto pt-4">
                    <Button
                      asChild
                      variant={tier.popular ? "default" : tier.variant}
                      className={`w-full ${tier.popular ? "gradient-primary" : ""}`}
                    >
                      <a href={tier.href}>{tier.cta}</a>
                    </Button>
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
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            <AlertCircle className="mr-1 inline-block h-4 w-4 text-yellow-400" />
            {t("note")}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("disclaimer")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
