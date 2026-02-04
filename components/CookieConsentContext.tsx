"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type CookieConsentContextType = {
  reopenBanner: () => void;
};

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [shouldReopen, setShouldReopen] = useState(false);

  const reopenBanner = () => {
    setShouldReopen(true);
    // Reset after a short delay to allow the banner to detect the change
    setTimeout(() => setShouldReopen(false), 100);
  };

  return (
    <CookieConsentContext.Provider value={{ reopenBanner }}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within CookieConsentProvider",
    );
  }
  return context;
}

// Hook to check if banner should reopen
export function useShouldReopenBanner() {
  const [shouldReopen, setShouldReopen] = useState(false);

  if (typeof window !== "undefined") {
    // Listen for custom event
    window.addEventListener("reopenCookieBanner", () => {
      setShouldReopen(true);
      setTimeout(() => setShouldReopen(false), 100);
    });
  }

  return shouldReopen;
}
