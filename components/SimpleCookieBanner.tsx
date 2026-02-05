"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

type ConsentStatus = "accepted" | "rejected" | null;

export function SimpleCookieBanner({ locale }: { locale: string }) {
  const [consent, setConsent] = useState<ConsentStatus>(null);
  const [mounted, setMounted] = useState(false);

  // Load consent from local storage on mount
  useEffect(() => {
    setMounted(true);
    const savedConsent = localStorage.getItem("loi25_consent");
    if (savedConsent) {
      setConsent(savedConsent as ConsentStatus);
    }

    // Listen for footer button click
    const handleReopen = () => setConsent(null);
    window.addEventListener("openCookieBanner", handleReopen);
    return () => window.removeEventListener("openCookieBanner", handleReopen);
  }, []);

  const handleAccept = () => {
    setConsent("accepted");
    localStorage.setItem("loi25_consent", "accepted");
    // Trigger any immediate tracking logic here if needed
  };

  const handleReject = () => {
    setConsent("rejected");
    localStorage.setItem("loi25_consent", "rejected");
    // Reload to purge any scripts if they were previously active
    window.location.reload();
  };

  const handleReset = () => {
    setConsent(null);
    localStorage.removeItem("loi25_consent");
    // window.location.reload(); // Don't reload immediately, let user choose
  };

  // Logic to load scripts based on consent
  const shouldLoadScripts = consent === "accepted";

  // Text content based on locale
  const t = {
    fr: {
      text: "Ce site utilise des témoins (cookies) pour analyser le trafic et améliorer votre expérience. Conformément à la Loi 25, nous avons besoin de votre consentement.",
      accept: "Tout accepter",
      reject: "Tout refuser",
      privacy: "Politique de confidentialité",
      manage: "Gérer les cookies",
    },
    en: {
      text: "This site uses cookies to analyze traffic and improve your experience. In compliance with Law 25, we need your consent.",
      accept: "Accept All",
      reject: "Reject All",
      privacy: "Privacy Policy",
      manage: "Manage Cookies",
    },
  };

  const content = locale === "fr" ? t.fr : t.en;

  // Don't render until mounted (hydration)
  if (!mounted) return null;

  return (
    <>
      {/* 
        GOOGLE ANALYTICS SCRIPT 
        Only loaded if consent is ACCEPTED 
      */}
      {shouldLoadScripts && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=G-PLACEHOLDER`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-PLACEHOLDER');
            `}
          </Script>
        </>
      )}

      {/* BANNER UI - Only show if no choice made */}
      {consent === null && (
        <div className="fixed bottom-0 left-0 right-0 z-[99999] bg-slate-900 border-t border-slate-700 p-6 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-slate-200 text-sm md:text-base pr-4">
              <p>
                {content.text}{" "}
                <a
                  href={`/${locale}/privacy`}
                  className="underline text-emerald-400 hover:text-emerald-300"
                >
                  {content.privacy}
                </a>
                .
              </p>
            </div>
            <div className="flex flex-row gap-3 whitespace-nowrap">
              <button
                onClick={handleReject}
                className="px-6 py-2.5 rounded-lg font-medium text-sm bg-slate-700 text-white hover:bg-slate-600 transition-colors border border-slate-600"
              >
                {content.reject}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 rounded-lg font-medium text-sm bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20"
              >
                {content.accept}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button to change consent later (Optional) */}
      {consent !== null && (
        <button
          onClick={handleReset}
          className="fixed bottom-4 right-4 z-[50] p-2 bg-slate-800/50 hover:bg-slate-800 text-slate-400 rounded-full border border-slate-700 transition-all text-xs"
          title={content.manage}
        >
          🍪
        </button>
      )}
    </>
  );
}
