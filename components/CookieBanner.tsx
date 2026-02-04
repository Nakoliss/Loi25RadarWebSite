"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Cookie, X, Settings } from "lucide-react";

type ConsentSettings = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<ConsentSettings>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      // Small delay before showing banner
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }

    // Listen for reopen event from Footer button
    const handleReopenBanner = () => {
      setIsVisible(true);
      setShowSettings(true); // Open directly to settings
    };

    window.addEventListener("reopenCookieBanner", handleReopenBanner);
    return () =>
      window.removeEventListener("reopenCookieBanner", handleReopenBanner);
  }, []);

  const saveConsent = (type: "all" | "reject" | "custom") => {
    let newSettings: ConsentSettings;

    if (type === "all") {
      newSettings = { necessary: true, analytics: true, marketing: true };
    } else if (type === "reject") {
      newSettings = { necessary: true, analytics: false, marketing: false };
    } else {
      newSettings = settings;
    }

    localStorage.setItem("cookie-consent", JSON.stringify(newSettings));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setIsVisible(false);

    // Here you would trigger/block analytics scripts based on consent
    if (newSettings.analytics) {
      // Enable analytics
    }
    if (newSettings.marketing) {
      // Enable marketing pixels
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <div className="mx-auto max-w-4xl rounded-lg border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-xl">
          {!showSettings ? (
            <>
              <div className="flex items-start gap-4">
                <div className="hidden rounded-full bg-primary/20 p-3 sm:block">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {t("title")}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("description")}
                  </p>
                </div>
                <button
                  onClick={() => saveConsent("reject")}
                  className="text-muted-foreground hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => saveConsent("all")}
                  className="flex-1 sm:flex-none"
                >
                  {t("accept")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => saveConsent("reject")}
                  className="flex-1 sm:flex-none"
                >
                  {t("reject")}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowSettings(true)}
                  className="flex-1 sm:flex-none"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  {t("customize")}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  {t("settingsTitle")}
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-muted-foreground hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4 space-y-4">
                {/* Necessary */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-white">
                      {t("necessaryTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("necessaryDescription")}
                    </p>
                  </div>
                  <div className="flex h-6 w-11 cursor-not-allowed items-center rounded-full bg-primary p-1">
                    <div className="h-4 w-4 translate-x-5 rounded-full bg-white" />
                  </div>
                </div>
                {/* Analytics */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-white">
                      {t("analyticsTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("analyticsDescription")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, analytics: !s.analytics }))
                    }
                    className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                      settings.analytics ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${
                        settings.analytics ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                {/* Marketing */}
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-white">
                      {t("marketingTitle")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("marketingDescription")}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, marketing: !s.marketing }))
                    }
                    className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                      settings.marketing ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full bg-white transition-transform ${
                        settings.marketing ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  onClick={() => saveConsent("custom")}
                  className="flex-1"
                >
                  {t("savePreferences")}
                </Button>
              </div>
            </>
          )}
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t("learnMorePrefix")}{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              {t("cookiePolicyLabel")}
            </Link>{" "}
            {t("learnMoreAnd")}{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              {t("privacyPolicyLabel")}
            </Link>
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
