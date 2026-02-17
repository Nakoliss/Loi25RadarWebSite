import Stripe from "stripe";

// Initialiser Stripe
// On utilise une clé bidon pour le build si la vraie est absente des variables d'environnement
const stripeSecretKey =
  process.env.STRIPE_SECRET_KEY || "sk_test_build_placeholder";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2026-01-28.clover" as any,
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
