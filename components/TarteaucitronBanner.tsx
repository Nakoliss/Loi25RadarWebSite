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
      services: Record<string, unknown>;
      userInterface: {
        openPanel: () => void;
      };
      lang: Record<string, string>;
    };
  }
}

// function TarteaucitronBanner() {
//   const locale = useLocale();
export function TarteaucitronBanner({ locale }: { locale: string }) {
  const initTarteaucitron = useCallback(() => {
    if (typeof window === "undefined" || !window.tarteaucitron) {
      console.log("Tarteaucitron: Script not loaded yet");
      return;
    }

    // Force panel open logic integration directly here
    const forceOpen = () => {
      console.log("WAITING TO FORCE OPEN...");
      setTimeout(() => {
        console.log("ATTEMPTING TO FORCE OPEN NOW");
        if (window.tarteaucitron && window.tarteaucitron.userInterface) {
          window.tarteaucitron.userInterface.openPanel();
        }
      }, 3000);
    };

    // Prevent double init
    if ((window as any).tarteaucitronInitialized) {
      console.log("Tarteaucitron: Already initialized");
      forceOpen(); // Still try to force open if re-rendering
      return;
    }
    (window as any).tarteaucitronInitialized = true;

    console.log("Tarteaucitron: Initializing...");
    const tarteaucitron = window.tarteaucitron;

    // DEBUG: Listener to see if job is processed
    // ...

    // ==========================================
    // REGISTER SERVICES FIRST (BEFORE init)
    // ==========================================

    // Use a standard service (Google Analytics) with dummy ID to ensure detection
    // This is safer than a custom service for testing
    tarteaucitron.user.gtagUa = "G-TEST123456";
    tarteaucitron.user.gtagMore = function () {};
    (tarteaucitron.job = tarteaucitron.job || []).push("gtag");

    // ==========================================
    // NOW CALL INIT (AFTER services are registered)
    // ==========================================

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
      highPrivacy: true,
      handleBrowserDNTRequest: false,

      // Design
      removeCredit: true,
      moreInfoLink: true,
      useExternalCss: true, // Loaded in layout.tsx
      useExternalJs: false,

      // Read more link
      readmoreLink: locale === "fr" ? "/fr/cookies" : "/en/cookies",
      mandatory: true, // Force modal for testing visibility

      // Don't use adblocker detection
      adblocker: false,

      // Default state: wait for user action
      serviceDefaultState: "wait",
    });

    console.log("Tarteaucitron: Initialized successfully");
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
            // Small delay to ensure DOM is ready
            setTimeout(initTarteaucitron, 100);
          }
        }}
      />
    </>
  );
}
