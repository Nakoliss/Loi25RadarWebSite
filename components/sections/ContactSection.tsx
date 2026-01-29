"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "@/components/ui/loader";
import { Mail, CheckCircle2, AlertTriangle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  domain: z.string().optional(),
  auditType: z.string().optional(),
  message: z.string().max(500).optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const t = useTranslations("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit");
      }

      setIsSuccess(true);
      reset();
    } catch {
      setError(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const auditTypes = [
    t("form.options.scanOnly"),
    t("form.options.scanFix"),
    t("form.options.complianceManager"),
  ];

  return (
    <section id="contact" className="py-20 sm:py-32 bg-card/50">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
            <Mail className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Contact</span>
          </div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-10"
        >
          <Card className="glass">
            <CardContent className="p-6 sm:p-8">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="mb-4 rounded-full bg-green-500/20 p-4">
                    <CheckCircle2 className="h-8 w-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Message envoyé!
                  </h3>
                  <p className="mt-2 text-muted-foreground">{t("success")}</p>
                  <Button
                    variant="outline"
                    className="mt-6"
                    onClick={() => setIsSuccess(false)}
                  >
                    Envoyer un autre message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Name */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        {t("form.name")} *
                      </label>
                      <Input
                        {...register("name")}
                        placeholder="Jean Tremblay"
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        {t("form.email")} *
                      </label>
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="jean@entreprise.ca"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Phone */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        {t("form.phone")}
                      </label>
                      <Input
                        {...register("phone")}
                        type="tel"
                        placeholder="514-555-1234"
                      />
                    </div>

                    {/* Domain */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white">
                        {t("form.domain")}
                      </label>
                      <Input
                        {...register("domain")}
                        placeholder="monentreprise.ca"
                      />
                    </div>
                  </div>

                  {/* Audit Type */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      {t("form.auditType")}
                    </label>
                    <select
                      {...register("auditType")}
                      className="flex h-11 w-full rounded-lg border border-border bg-input px-4 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="" className="bg-slate-900 text-white">
                        {t("form.selectType")}
                      </option>
                      {auditTypes.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-slate-900 text-white"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white">
                      {t("form.message")}
                    </label>
                    <Textarea
                      {...register("message")}
                      placeholder="Décrivez vos besoins..."
                      rows={4}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader size="sm" />
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        {t("form.submit")}
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
