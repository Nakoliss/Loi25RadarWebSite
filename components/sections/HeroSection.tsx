"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("hero");

  const features = t("platforms").split(", ");

  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10" />
        <motion.div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-3xl"
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t("compliance_badge")}
              </span>
            </div>

            <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              {t("subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button asChild size="lg" className="gradient-primary glow">
              <a href="#audit">
                {t("cta")}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#pricing">Voir les forfaits</a>
            </Button>
          </motion.div>

          {/* Platform badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <p className="mb-4 text-sm text-muted-foreground">
              {t("supported_platforms")}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm text-white">{feature}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("avg_delay_label")} {t("delay")}
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-20 grid gap-8 sm:grid-cols-3"
        >
          <div className="text-center">
            <p className="text-4xl font-bold text-primary">
              {t("stats.fine.value")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("stats.fine.label")}
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-secondary">
              {t("stats.scan.value")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("stats.scan.label")}
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-white">
              {t("stats.time.value")}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("stats.time.label")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
