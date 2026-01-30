import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Shield, Users, Target, Award, CheckCircle2 } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const tc = useTranslations("company");

  const values = [
    {
      icon: Shield,
      title: "Protection",
      description:
        "Nous aidons les entreprises québécoises à protéger les données personnelles de leurs clients conformément à la Loi 25.",
    },
    {
      icon: Users,
      title: "Accessibilité",
      description:
        "La conformité Loi 25 devrait être accessible à toutes les entreprises, quelle que soit leur taille.",
    },
    {
      icon: Target,
      title: "Précision",
      description:
        "Nos scans et audits sont rigoureux et fournissent des recommandations actionnables.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "Nous nous engageons à fournir un service de qualité supérieure avec un délai de 2 à 5 jours.",
    },
  ];

  const services = [
    "Scan gratuit (détection cookies/traceurs)",
    "Mise en place de bannière de consentement (CMP)",
    "Rédaction/mise à jour de politique de confidentialité",
    "Affichage du responsable RP",
    "Monitoring hebdomadaire automatisé",
  ];

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">À propos</span>
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            {tc("name")}
          </h1>
          <p className="mt-2 text-lg text-primary">Loi 25 Radar</p>
          <p className="mt-4 text-muted-foreground">{tc("division")}</p>
          <p className="mt-6 text-lg text-muted-foreground">
            {tc("description")}
          </p>
        </div>

        {/* Mission */}
        <Card className="mt-16 glass">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white">Notre Mission</h2>
            <p className="mt-4 text-muted-foreground">
              Nous avons créé Loi 25 Radar pour aider les entreprises
              québécoises à naviguer dans le paysage complexe de la protection
              des données personnelles. Notre objectif est de rendre la
              conformité Loi 25 accessible, compréhensible et réalisable pour
              toutes les entreprises — que vous utilisiez Wix, WordPress,
              Shopify ou un site sur mesure.
            </p>
            <p className="mt-4 text-muted-foreground">
              La Loi 25 représente un changement majeur dans la façon dont les
              entreprises doivent traiter les données personnelles au Québec.
              Nous croyons que chaque entreprise mérite les outils et les
              connaissances nécessaires pour se conformer à ces nouvelles
              exigences.
            </p>
          </CardContent>
        </Card>

        {/* Services */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-white">
            Ce que nous faisons
          </h2>
          <Card className="mt-8 glass">
            <CardContent className="p-8">
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{service}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-center text-2xl font-bold text-white">
            Nos Valeurs
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {values.map((value, index) => (
              <Card key={index} className="glass">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/20 p-3">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <Card className="mt-16 glass">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold text-white">Nous contacter</h2>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p>
                <strong className="text-white">Courriel:</strong>{" "}
                <a
                  href={`mailto:${tc("email")}`}
                  className="text-primary hover:underline"
                >
                  {tc("email")}
                </a>
              </p>
              <p>
                <strong className="text-white">Téléphone:</strong> {tc("phone")}
              </p>
              <p>
                <strong className="text-white">Adresse:</strong> {tc("address")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="mt-16 gradient-primary">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white">Prêt à commencer?</h2>
            <p className="mt-4 text-white/80">
              Scannez gratuitement votre site ou demandez un devis pour une mise
              en conformité complète.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/#audit"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-primary transition-all hover:bg-white/90"
              >
                Scan gratuit
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-semibold text-white transition-all hover:bg-white/20"
              >
                Demander un devis
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
