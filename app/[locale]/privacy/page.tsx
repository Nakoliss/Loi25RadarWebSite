import { setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const lastUpdated = "28 janvier 2026";

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Loi 25</span>
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Politique de Confidentialité
          </h1>
          <p className="mt-4 text-muted-foreground">
            Dernière mise à jour: {lastUpdated}
          </p>
        </div>

        <Card className="mt-12 glass">
          <CardContent className="prose prose-invert max-w-none p-8 space-y-8">
            {/* Responsable de la protection */}
            <div className="rounded-lg border border-primary/30 bg-primary/10 p-4">
              <h2 className="mt-0 text-lg font-semibold text-white">
                Responsable de la protection des renseignements personnels
              </h2>
              <p className="mb-0 text-muted-foreground">
                <strong>Daniel Germain</strong>
                <br />
                Courriel:{" "}
                <a
                  href="mailto:privacy@solutionsimpactweb.com"
                  className="text-primary hover:underline"
                >
                  privacy@solutionsimpactweb.com
                </a>
                <br />
                Adresse: Montréal, QC Canada
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-white">
                1. Introduction et engagement
              </h2>
              <p className="text-muted-foreground">
                Solutions Impact Web Inc. (&quot;nous&quot;, &quot;notre&quot;,
                &quot;nos&quot;), exploitant la marque Loi 25 Radar,
                s&apos;engage à protéger la confidentialité de vos
                renseignements personnels conformément à la Loi 25 du Québec
                (Loi modernisant des dispositions législatives en matière de
                protection des renseignements personnels) et à la LPRPDE
                (PIPEDA) fédérale.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                2. Renseignements personnels collectés
              </h2>
              <p className="text-muted-foreground">
                Nous collectons uniquement les renseignements nécessaires à la
                fourniture de nos services:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  <strong>Données d&apos;identification:</strong> Nom, adresse
                  courriel, numéro de téléphone
                </li>
                <li>
                  <strong>Données professionnelles:</strong> Nom de
                  l&apos;entreprise, URL du site web
                </li>
                <li>
                  <strong>Données techniques:</strong> Cookies strictement
                  nécessaires, données de navigation
                </li>
                <li>
                  <strong>Données de paiement:</strong> Traitées par notre
                  processeur de paiement (Stripe), nous ne conservons pas vos
                  données de carte
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                3. Finalités de la collecte et base légale
              </h2>
              <p className="text-muted-foreground">
                Vos renseignements sont utilisés exclusivement pour:
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left text-white">Finalité</th>
                    <th className="py-2 text-left text-white">Base légale</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/50">
                    <td className="py-2">Fournir nos services d&apos;audit</td>
                    <td className="py-2">Contrat</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Répondre à vos demandes</td>
                    <td className="py-2">Consentement</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Améliorer nos services</td>
                    <td className="py-2">Intérêt légitime</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-2">Obligations légales</td>
                    <td className="py-2">Obligation légale</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                4. Conservation des données
              </h2>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  <strong>Résultats de scan gratuit:</strong> Non conservés
                  après affichage
                </li>
                <li>
                  <strong>Données de contact:</strong> 3 ans après le dernier
                  contact ou la fin des services
                </li>
                <li>
                  <strong>Données de facturation:</strong> 7 ans (obligation
                  fiscale)
                </li>
                <li>
                  <strong>Rapports d&apos;audit:</strong> Durée du contrat + 1
                  an
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                5. Vos droits (Loi 25)
              </h2>
              <p className="text-muted-foreground">
                Conformément à la Loi 25, vous disposez des droits suivants:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  <strong>Droit d&apos;accès:</strong> Obtenir une copie de vos
                  renseignements personnels
                </li>
                <li>
                  <strong>Droit de rectification:</strong> Corriger des
                  renseignements inexacts
                </li>
                <li>
                  <strong>Droit à l&apos;effacement:</strong> Demander la
                  suppression de vos données (droit à l&apos;oubli)
                </li>
                <li>
                  <strong>Droit à la portabilité:</strong> Recevoir vos données
                  dans un format structuré
                </li>
                <li>
                  <strong>Droit de retrait du consentement:</strong> Retirer
                  votre consentement à tout moment
                </li>
                <li>
                  <strong>Droit de plainte:</strong> Porter plainte auprès de la
                  Commission d&apos;accès à l&apos;information (CAI) du Québec
                </li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                Pour exercer vos droits, contactez:{" "}
                <a
                  href="mailto:privacy@solutionsimpactweb.com"
                  className="text-primary hover:underline"
                >
                  privacy@solutionsimpactweb.com
                </a>
              </p>
              <p className="text-muted-foreground">
                Délai de réponse: 30 jours (conformément à la Loi 25).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                6. Mesures de sécurité
              </h2>
              <p className="text-muted-foreground">
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>Chiffrement SSL/TLS pour toutes les transmissions</li>
                <li>Hébergement sécurisé (Vercel/AWS)</li>
                <li>
                  Accès restreint aux données (principe du moindre privilège)
                </li>
                <li>Journalisation des accès</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                7. Cookies et technologies similaires
              </h2>
              <p className="text-muted-foreground">
                Ce site utilise des cookies. Consultez notre{" "}
                <a href="/cookies" className="text-primary hover:underline">
                  Politique des cookies
                </a>{" "}
                pour plus de détails et gérer vos préférences.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                8. Transferts et sous-traitants
              </h2>
              <p className="text-muted-foreground">
                Certaines données peuvent être traitées par nos sous-traitants:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground">
                <li>
                  Vercel (hébergement) - États-Unis (clauses contractuelles)
                </li>
                <li>Resend (courriels) - États-Unis</li>
                <li>Stripe (paiements) - États-Unis</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                9. Incidents de confidentialité
              </h2>
              <p className="text-muted-foreground">
                Conformément à la Loi 25, nous maintenons un registre des
                incidents de confidentialité et notifierons la CAI et les
                personnes concernées dans les délais prescrits en cas
                d&apos;incident présentant un risque de préjudice sérieux.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">
                10. Modifications
              </h2>
              <p className="text-muted-foreground">
                Cette politique peut être mise à jour. Les modifications
                importantes seront communiquées par courriel ou par avis sur le
                site. La date de dernière mise à jour est indiquée en haut de ce
                document.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white">11. Contact</h2>
              <p className="text-muted-foreground">
                Pour toute question concernant cette politique ou vos
                renseignements personnels:
              </p>
              <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
                <p className="mb-0 text-muted-foreground">
                  <strong className="text-white">
                    Solutions Impact Web Inc.
                  </strong>
                  <br />
                  Responsable: Daniel Germain
                  <br />
                  Courriel:{" "}
                  <a
                    href="mailto:privacy@solutionsimpactweb.com"
                    className="text-primary"
                  >
                    privacy@solutionsimpactweb.com
                  </a>
                  <br />
                  Téléphone: (438) 503-3698
                  <br />
                  Adresse: Montréal, QC Canada
                </p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
