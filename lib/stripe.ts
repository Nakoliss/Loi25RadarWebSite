import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-01-28.clover", // Use latest stable API version
  typescript: true,
});

export const PLANS = {
  scanOnly: {
    id: "scanOnly",
    name: {
      fr: "Scan Complet",
      en: "Complete Scan",
    },
    price: 199,
    mode: "payment" as const,
  },
  scanFix: {
    id: "scanFix",
    name: {
      fr: "Scan Complet + Correction",
      en: "Complete Scan + Fix",
    },
    price: 699,
    mode: "payment" as const,
  },
  complianceManager: {
    id: "complianceManager",
    name: {
      fr: "Gestionnaire de Conformité",
      en: "Compliance Manager",
    },
    oneTimePrice: 699,
    recurringPrice: 79,
    mode: "subscription" as const,
  },
};
