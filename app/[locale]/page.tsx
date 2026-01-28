import { setRequestLocale } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { AuditSection } from "@/components/sections/AuditSection";
import { WhyLoi25Section } from "@/components/sections/WhyLoi25Section";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AuditSection />
      <WhyLoi25Section />
      <FeaturesSection />
      <PricingSection />
      <FAQSection />
      <ContactSection />
    </>
  );
}
