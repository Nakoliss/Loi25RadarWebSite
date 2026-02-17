"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const t = useTranslations("checkout.success");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-emerald-500/20 p-6 glow-emerald">
            <CheckCircle2 className="h-20 w-20 text-emerald-500" />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          {t("title")}
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mb-12">
          {t("message")}
          <br />
          <span className="text-base mt-4 block opacity-80">
            {t("details")}
          </span>
        </p>

        {sessionId && (
          <p className="text-[10px] text-muted-foreground mb-8">
            Session ID: {sessionId}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            variant="default"
            className="gradient-primary"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              {t("backHome")}
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}
