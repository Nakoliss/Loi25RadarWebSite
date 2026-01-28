import { setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/20 px-4 py-2">
            <Cookie className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-secondary">Cookies</span>
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Politique des Cookies
          </h1>
          <p className="mt-4 text-muted-foreground">
            Dernière mise à jour: 28 janvier 2026
          </p>
        </div>

        <Card className="mt-12 glass">
          <CardContent className="prose prose-invert max-w-none p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white">
                Qu&apos;est-ce qu&apos;un cookie?
              </h2>
              <p className="text-muted-foreground">
                Un cookie est un petit fichier texte stocké sur votre appareil
                (ordinateur, tablette, téléphone) lorsque vous visitez un site
                web. Les cookies permettent au site de se souvenir de vos
                actions et préférences pendant une période donnée.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                Types de cookies utilisés
              </h2>

              <h3 className="mt-4 text-lg font-medium text-white">
                1. Cookies strictement nécessaires
              </h3>
              <p className="text-muted-foreground">
                Ces cookies sont essentiels au fonctionnement du site. Ils ne
                peuvent pas être désactivés. Ils incluent:
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left text-white">Nom</th>
                    <th className="py-2 text-left text-white">Finalité</th>
                    <th className="py-2 text-left text-white">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2">cookie-consent</td>
                    <td className="py-2">Stocke vos préférences de cookies</td>
                    <td className="py-2">1 an</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">NEXT_LOCALE</td>
                    <td className="py-2">Stocke votre préférence de langue</td>
                    <td className="py-2">Session</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="mt-6 text-lg font-medium text-white">
                2. Cookies analytiques (optionnels)
              </h3>
              <p className="text-muted-foreground">
                Ces cookies nous aident à comprendre comment les visiteurs
                utilisent notre site. Toutes les données sont anonymisées.
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left text-white">Nom</th>
                    <th className="py-2 text-left text-white">Fournisseur</th>
                    <th className="py-2 text-left text-white">Durée</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2">_ga, _ga_*</td>
                    <td className="py-2">Google Analytics</td>
                    <td className="py-2">2 ans</td>
                  </tr>
                </tbody>
              </table>

              <h3 className="mt-6 text-lg font-medium text-white">
                3. Cookies marketing (optionnels)
              </h3>
              <p className="text-muted-foreground">
                Ces cookies sont utilisés pour diffuser des publicités
                pertinentes. Nous ne les activons qu&apos;avec votre
                consentement explicite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                Gérer vos préférences
              </h2>
              <p className="text-muted-foreground">
                Vous pouvez modifier vos préférences de cookies à tout moment:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  En cliquant sur &quot;Paramètres des cookies&quot; dans le
                  pied de page
                </li>
                <li>En supprimant les cookies de votre navigateur</li>
                <li>
                  En configurant votre navigateur pour bloquer certains cookies
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Note: Le blocage de certains cookies peut affecter votre
                expérience sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                Conformité Loi 25
              </h2>
              <p className="text-muted-foreground">
                Conformément à la Loi 25 du Québec, nous:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  Demandons votre consentement explicite avant d&apos;activer
                  les cookies non essentiels
                </li>
                <li>
                  Conservons une trace de votre consentement (date et
                  préférences)
                </li>
                <li>
                  Vous permettons de modifier ou retirer votre consentement à
                  tout moment
                </li>
                <li>
                  N&apos;activons aucun traceur avant d&apos;avoir obtenu votre
                  consentement
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant notre utilisation des cookies,
                contactez notre responsable de la protection des renseignements
                personnels:
              </p>
              <p className="mt-2 text-muted-foreground">
                <a
                  href="mailto:privacy@solutionsimpactweb.com"
                  className="text-primary hover:underline"
                >
                  privacy@solutionsimpactweb.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
