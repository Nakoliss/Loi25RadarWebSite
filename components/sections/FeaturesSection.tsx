"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Lock,
  Cookie,
  Shield,
  FormInput,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export function FeaturesSection() {
  const t = useTranslations("features");

  const features = t.raw("items") as Array<{
    title: string;
    description: string;
  }>;
  const limitations = t.raw("limitations.items") as string[];

  const icons = [FileText, Lock, Cookie, Shield, FormInput];

  return (
    <section className="py-20 sm:py-32">
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
        </motion.div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full transition-all hover:border-primary/50 hover:glow-emerald">
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex rounded-lg bg-primary/20 p-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Limitations & CTA */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Limitations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-4 flex items-center gap-3">
                  <AlertCircle className="h-6 w-6 text-yellow-400" />
                  <h3 className="text-xl font-semibold text-white">
                    {t("limitations.title")}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {limitations.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center"
          >
            <Card className="w-full gradient-primary">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-2xl font-bold text-white">{t("cta")}</h3>
                <p className="mt-4 text-white/80">
                  Notre audit complet analyse 12 critères de conformité avec
                  rapport détaillé, screenshots et plan d&apos;action
                  personnalisé.
                </p>
                <Button
                  variant="outline"
                  size="lg"
                  className="mt-6 border-white/30 bg-white/10 text-white hover:bg-white/20"
                  asChild
                >
                  <a href="#pricing">
                    Voir les forfaits
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
