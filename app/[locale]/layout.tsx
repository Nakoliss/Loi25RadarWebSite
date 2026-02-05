import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SimpleCookieBanner } from "@/components/SimpleCookieBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string } | Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";

  return {
    title: isEn
      ? "Loi 25 Radar | Solutions Impact Web - Law 25 Compliance"
      : "Loi 25 Radar | Solutions Impact Web - Conformite Loi 25",
    description: isEn
      ? "Make your website Law 25 compliant, hassle-free. Free scan, compliance and monitoring. Wix, WordPress, Shopify."
      : "Rendez votre site conforme a la Loi 25 sans casse-tete. Scan gratuit, mise en conformite et monitoring. Wix, WordPress, Shopify.",
    keywords: isEn
      ? [
          "Law 25",
          "compliance",
          "Quebec",
          "cookies",
          "GDPR",
          "CAI",
          "data protection",
        ]
      : [
          "Loi 25",
          "conformite",
          "Quebec",
          "cookies",
          "RGPD",
          "CAI",
          "protection donnees",
        ],
    authors: [{ name: "Solutions Impact Web" }],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: isEn
        ? "Loi 25 Radar - Law 25 Compliance"
        : "Loi 25 Radar - Conformite Loi 25 du Quebec",
      description: isEn
        ? "Free scan in 30 seconds. Compliance starting at $499."
        : "Scan gratuit en 30 secondes. Mise en conformite a partir de 499$.",
      siteName: "Loi 25 Radar",
      locale: isEn ? "en_CA" : "fr_CA",
      type: "website",
      images: [
        {
          url: "/logo.png",
          width: 400,
          height: 100,
          alt: "Solutions Impact Web - Loi 25 Radar",
        },
      ],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as "fr" | "en")) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>

        <SimpleCookieBanner locale={locale} />
      </body>
    </html>
  );
}
