import { setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";

export default async function TermsPage({
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
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Conditions d&apos;Utilisation
          </h1>
          <p className="mt-4 text-muted-foreground">
            Dernière mise à jour: 28 janvier 2026
          </p>
        </div>

        <Card className="mt-12 glass">
          <CardContent className="prose prose-invert max-w-none p-8">
            <h2 className="text-xl font-semibold text-white">
              1. Acceptation des Conditions
            </h2>
            <p className="text-muted-foreground">
              En utilisant les services de Loi 25 Watchtower, vous acceptez
              d&apos;être lié par les présentes conditions d&apos;utilisation.
              Si vous n&apos;acceptez pas ces conditions, veuillez ne pas
              utiliser nos services.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-white">
              2. Description des Services
            </h2>
            <p className="text-muted-foreground">Loi 25 Watchtower fournit:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>
                Un outil d&apos;audit gratuit pour évaluer la conformité Loi 25
              </li>
              <li>Des audits complets payants avec rapport détaillé</li>
              <li>Des recommandations de conformité</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-white">
              3. Limitations du Service Gratuit
            </h2>
            <p className="text-muted-foreground">
              L&apos;audit gratuit est fourni à titre indicatif uniquement. Il
              ne constitue pas un avis juridique et ne garantit pas la
              conformité complète à la Loi 25. Nous recommandons un audit
              complet pour une évaluation exhaustive.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-white">
              4. Utilisation Acceptable
            </h2>
            <p className="text-muted-foreground">Vous vous engagez à:</p>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Utiliser nos services de manière légale</li>
              <li>
                Ne scanner que les sites dont vous êtes propriétaire ou autorisé
              </li>
              <li>Ne pas tenter de contourner les limitations du service</li>
              <li>Ne pas utiliser nos services à des fins malveillantes</li>
            </ul>

            <h2 className="mt-8 text-xl font-semibold text-white">
              5. Propriété Intellectuelle
            </h2>
            <p className="text-muted-foreground">
              Tous les contenus, marques et technologies de Loi 25 Watchtower
              sont notre propriété exclusive. Aucune licence n&apos;est accordée
              sur ces éléments sauf utilisation normale des services.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-white">
              6. Limitation de Responsabilité
            </h2>
            <p className="text-muted-foreground">
              Nos services sont fournis &quot;tels quels&quot;. Nous ne
              garantissons pas l&apos;exactitude complète des résultats
              d&apos;audit. En aucun cas, nous ne serons responsables des
              dommages indirects, accessoires ou consécutifs découlant de
              l&apos;utilisation de nos services.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-white">
              7. Tarification et Paiement
            </h2>
            <p className="text-muted-foreground">
              Les tarifs des audits payants sont affichés sur notre site. Les
              prix sont en dollars canadiens et peuvent être modifiés sans
              préavis. Le paiement est dû avant la livraison du rapport
              d&apos;audit.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-white">
              8. Résiliation
            </h2>
            <p className="text-muted-foreground">
              Nous nous réservons le droit de suspendre ou résilier votre accès
              à nos services en cas de violation des présentes conditions.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-white">
              9. Loi Applicable
            </h2>
            <p className="text-muted-foreground">
              Les présentes conditions sont régies par les lois du Québec et du
              Canada. Tout litige sera soumis aux tribunaux compétents du
              Québec.
            </p>

            <h2 className="mt-8 text-xl font-semibold text-white">
              10. Contact
            </h2>
            <p className="text-muted-foreground">
              Pour toute question concernant ces conditions, contactez-nous à:
              legal@loi25watchtower.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
