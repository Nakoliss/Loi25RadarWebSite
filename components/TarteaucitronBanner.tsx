"use client";

import { useEffect, useCallback } from "react";
import Script from "next/script";
import { useLocale } from "next-intl";

declare global {
  interface Window {
    tarteaucitron: {
      init: (config: Record<string, unknown>) => void;
      job: string[];
      user: Record<string, unknown>;
      userInterface: {
        openPanel: () => void;
      };
      lang: Record<string, string>;
    };
  }
}

export function TarteaucitronBanner() {
  const locale = useLocale();

  const initTarteaucitron = useCallback(() => {
    if (typeof window === "undefined" || !window.tarteaucitron) return;

    const tarteaucitron = window.tarteaucitron;

    // Set language texts based on locale
    const texts =
      locale === "fr"
        ? {
            middleBarHead: "🍪 Gestion des cookies",
            alertBigTitle: "Respect de votre vie privée",
            alertBigMessage:
              "Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. Vous pouvez accepter tous les cookies, les refuser ou personnaliser vos préférences.",
            acceptAll: "Tout accepter",
            personalize: "Personnaliser",
            close: "Fermer",
            denyAll: "Tout refuser",
            privacyUrl: "Politique de confidentialité",
            allow: "Autoriser",
            deny: "Refuser",
            noCookie: "Ce service ne dépose aucun cookie.",
            useCookie: "Ce service peut déposer",
            useCookieCurrent: "Ce service a déposé",
            useNoCookie: "Ce service n'a déposé aucun cookie.",
            more: "En savoir plus",
            source: "Voir le site officiel",
            credit: "",
            fallback: "est désactivé.",
          }
        : {
            middleBarHead: "🍪 Cookie Management",
            alertBigTitle: "Respect for your privacy",
            alertBigMessage:
              "We use cookies to improve your experience and analyze our traffic. You can accept all cookies, reject them, or customize your preferences.",
            acceptAll: "Accept all",
            personalize: "Customize",
            close: "Close",
            denyAll: "Reject all",
            privacyUrl: "Privacy Policy",
            allow: "Allow",
            deny: "Deny",
            noCookie: "This service does not use any cookies.",
            useCookie: "This service may use",
            useCookieCurrent: "This service has used",
            useNoCookie: "This service has not used any cookies.",
            more: "Learn more",
            source: "View official website",
            credit: "",
            fallback: "is disabled.",
          };

    // Apply custom language texts
    if (tarteaucitron.lang) {
      Object.assign(tarteaucitron.lang, texts);
    }

    tarteaucitron.init({
      // General settings
      privacyUrl: locale === "fr" ? "/fr/privacy" : "/en/privacy",
      hashtag: "#tarteaucitron",
      cookieName: "tarteaucitron",
      orientation: "bottom",

      // Behavior
      groupServices: false,
      showAlertSmall: false,
      cookieslist: true,
      closePopup: false,
      showIcon: true,
      iconPosition: "BottomRight",

      // Buttons
      DenyAllCta: true,
      AcceptAllCta: true,
      highPrivacy: true, // IMPORTANT: Blocks all until explicit consent
      handleBrowserDNTRequest: false,

      // Design
      removeCredit: true,
      moreInfoLink: true,
      useExternalCss: false,
      useExternalJs: false,

      // Read more link
      readmoreLink: locale === "fr" ? "/fr/cookies" : "/en/cookies",
      mandatory: true,

      // Don't use adblocker detection
      adblocker: false,

      // Default state: wait for user action
      serviceDefaultState: "wait",
    });

    // ==========================================
    // ADD SERVICES TO BLOCK HERE
    // ==========================================

    // GOOGLE ANALYTICS 4 (uncomment and configure when ready)
    // Replace G-XXXXXXXXXX with your real GA4 ID
    /*
    (tarteaucitron.job = tarteaucitron.job || []).push('gtag');
    tarteaucitron.user.gtagUa = 'G-XXXXXXXXXX';
    tarteaucitron.user.gtagMore = function () {};
    */

    // META PIXEL / FACEBOOK PIXEL (uncomment and configure when ready)
    // Replace XXXXXXXXXX with your real Pixel ID
    /*
    (tarteaucitron.job = tarteaucitron.job || []).push('facebookpixel');
    tarteaucitron.user.facebookpixelId = 'XXXXXXXXXX';
    tarteaucitron.user.facebookpixelMore = function () {};
    */

    // GOOGLE TAG MANAGER (uncomment and configure when ready)
    /*
    (tarteaucitron.job = tarteaucitron.job || []).push('gtm');
    tarteaucitron.user.googletagmanagerId = 'GTM-XXXXXXX';
    */

    // LINKEDIN INSIGHT TAG (uncomment and configure when ready)
    /*
    (tarteaucitron.job = tarteaucitron.job || []).push('linkedin');
    tarteaucitron.user.linkedinPartnerId = 'XXXXXXX';
    */

    // HOTJAR (uncomment and configure when ready)
    /*
    (tarteaucitron.job = tarteaucitron.job || []).push('hotjar');
    tarteaucitron.user.hotjarId = 'XXXXXXX';
    tarteaucitron.user.HotjarSv = 6;
    */
  }, [locale]);

  useEffect(() => {
    // Listen for reopen event from Footer button
    const handleReopenPanel = () => {
      if (
        typeof window !== "undefined" &&
        window.tarteaucitron?.userInterface
      ) {
        window.tarteaucitron.userInterface.openPanel();
      }
    };

    window.addEventListener("openTarteaucitronPanel", handleReopenPanel);
    return () =>
      window.removeEventListener("openTarteaucitronPanel", handleReopenPanel);
  }, []);

  return (
    <>
      {/* Load Tarteaucitron.js from CDN */}
      <Script
        src="https://cdn.jsdelivr.net/gh/AmauriC/tarteaucitron.js@1.17.0/tarteaucitron.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== "undefined") {
            initTarteaucitron();
          }
        }}
      />

      {/* Custom CSS to match site design */}
      <style jsx global>{`
        /* Main banner */
        #tarteaucitronRoot #tarteaucitronAlertBig {
          background: linear-gradient(
            135deg,
            #1e293b 0%,
            #0f172a 100%
          ) !important;
          border-top: 3px solid #10b981 !important;
          box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3) !important;
          padding: 30px !important;
          max-width: 100% !important;
        }

        /* Title */
        #tarteaucitronRoot #tarteaucitronDisclaimerAlert {
          color: #f1f5f9 !important;
          font-size: 18px !important;
          font-weight: 600 !important;
          margin-bottom: 15px !important;
        }

        /* Description text */
        #tarteaucitronRoot #tarteaucitronDisclaimerAlert + div {
          color: #cbd5e1 !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          margin-bottom: 20px !important;
        }

        /* All buttons base styles */
        #tarteaucitronRoot .tarteaucitronAllow,
        #tarteaucitronRoot .tarteaucitronDeny,
        #tarteaucitronRoot #tarteaucitronCloseAlert,
        #tarteaucitronRoot #tarteaucitronPrivacyUrl {
          border-radius: 8px !important;
          padding: 12px 24px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          transition: all 0.3s ease !important;
          border: none !important;
          cursor: pointer !important;
        }

        /* Accept All button */
        #tarteaucitronRoot #tarteaucitronAllAllowed {
          background: #10b981 !important;
          color: white !important;
        }

        #tarteaucitronRoot #tarteaucitronAllAllowed:hover {
          background: #059669 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4) !important;
        }

        /* Deny All button */
        #tarteaucitronRoot #tarteaucitronAllDenied {
          background: transparent !important;
          color: #94a3b8 !important;
          border: 2px solid #475569 !important;
        }

        #tarteaucitronRoot #tarteaucitronAllDenied:hover {
          background: #475569 !important;
          color: white !important;
        }

        /* Customize button */
        #tarteaucitronRoot #tarteaucitronCloseAlert {
          background: transparent !important;
          color: #10b981 !important;
          border: 2px solid #10b981 !important;
        }

        #tarteaucitronRoot #tarteaucitronCloseAlert:hover {
          background: #10b981 !important;
          color: white !important;
        }

        /* Privacy policy link */
        #tarteaucitronRoot #tarteaucitronPrivacyUrl {
          background: transparent !important;
          color: #10b981 !important;
          text-decoration: underline !important;
          padding: 8px 16px !important;
        }

        /* Floating icon after choice */
        #tarteaucitronRoot #tarteaucitronIcon {
          background: #10b981 !important;
          border-radius: 50% !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3) !important;
        }

        /* Customization panel */
        #tarteaucitronRoot #tarteaucitron {
          background: #1e293b !important;
          border: 2px solid #334155 !important;
          border-radius: 12px !important;
        }

        #tarteaucitronRoot #tarteaucitronServices {
          background: #1e293b !important;
        }

        /* Individual services */
        #tarteaucitronRoot .tarteaucitronLine {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
          margin-bottom: 10px !important;
          border-radius: 8px !important;
          padding: 15px !important;
        }

        #tarteaucitronRoot .tarteaucitronName {
          color: #f1f5f9 !important;
          font-weight: 600 !important;
        }

        #tarteaucitronRoot .tarteaucitronListCookies {
          color: #94a3b8 !important;
        }

        /* Toggle switches */
        #tarteaucitronRoot .tarteaucitronAllow {
          background: #10b981 !important;
          color: white !important;
        }

        #tarteaucitronRoot .tarteaucitronDeny {
          background: #ef4444 !important;
          color: white !important;
        }

        /* Panel header */
        #tarteaucitronRoot #tarteaucitronClosePanel {
          color: #f1f5f9 !important;
        }

        #tarteaucitronRoot .tarteaucitronH1,
        #tarteaucitronRoot .tarteaucitronH2,
        #tarteaucitronRoot .tarteaucitronH3 {
          color: #f1f5f9 !important;
        }

        /* Back button */
        #tarteaucitronRoot #tarteaucitronBack {
          background: rgba(0, 0, 0, 0.7) !important;
        }

        /* Scrollbar styling */
        #tarteaucitronRoot #tarteaucitronServices::-webkit-scrollbar {
          width: 8px;
        }

        #tarteaucitronRoot #tarteaucitronServices::-webkit-scrollbar-track {
          background: #1e293b;
        }

        #tarteaucitronRoot #tarteaucitronServices::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 4px;
        }

        #tarteaucitronRoot
          #tarteaucitronServices::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        /* Responsive */
        @media (max-width: 768px) {
          #tarteaucitronRoot #tarteaucitronAlertBig {
            padding: 20px !important;
          }

          #tarteaucitronRoot .tarteaucitronAllow,
          #tarteaucitronRoot .tarteaucitronDeny,
          #tarteaucitronRoot #tarteaucitronCloseAlert {
            width: 100% !important;
            margin: 5px 0 !important;
          }
        }
      `}</style>
    </>
  );
}
