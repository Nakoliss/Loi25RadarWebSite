"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CreditCard, ShieldCheck, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PreCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  planName: string;
}

export function PreCheckoutModal({
  isOpen,
  onClose,
  planId,
  planName,
}: PreCheckoutModalProps) {
  const t = useTranslations("checkout.modal");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    websiteUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalUrl = formData.websiteUrl.trim();
    if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          websiteUrl: finalUrl,
          planId,
          locale,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error("Checkout redirect error:", error);
      alert(t("error"));
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg z-10"
          >
            <Card className="shadow-2xl border-primary/20" glow="emerald">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-muted-foreground hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <ShieldCheck className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {t("secureCheckout")}
                  </span>
                </div>
                <CardTitle className="text-2xl">
                  {t("title")} <span className="text-primary">{planName}</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("subtitle")}
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white ml-1">
                      {t("nameLabel")}
                    </label>
                    <Input
                      name="name"
                      required
                      placeholder={t("namePlaceholder")}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white ml-1">
                      {t("emailLabel")}
                    </label>
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder={t("emailPlaceholder")}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white ml-1">
                      {t("urlLabel")}
                    </label>
                    <div className="relative">
                      <Input
                        name="websiteUrl"
                        type="text"
                        required
                        placeholder="votre-site.com"
                        className="pl-10"
                        value={formData.websiteUrl}
                        onChange={handleChange}
                      />
                      <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-1 italic">
                      {t("urlNote")}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 text-base font-bold shadow-lg shadow-emerald-900/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t("redirecting")}
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          {t("proceedToPayment")}
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-center text-[11px] text-muted-foreground mt-4">
                    🔒 {t("secureNote")}
                  </p>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
