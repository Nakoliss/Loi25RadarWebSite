import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All supported locales
  locales: ["fr", "en"],

  // Default locale when no prefix is provided
  defaultLocale: "fr",

  // Always show locale prefix in URL
  localePrefix: "always",

  // Disable automatic locale detection to force defaultLocale (fr) for first visit
  localeDetection: false,
});
