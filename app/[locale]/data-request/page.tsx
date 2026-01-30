import { setRequestLocale } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail } from "lucide-react";

export default async function DataRequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (locale === "en") {
    return (
      <div className="py-20 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Law 25</span>
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Data Access Request
            </h1>
            <p className="mt-4 text-muted-foreground">
              Exercise your rights under Law 25 and PIPEDA
            </p>
          </div>

          <Card className="mt-12 glass">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-white">Your rights</h2>
              <p className="mt-2 text-muted-foreground">
                In accordance with Quebec Law 25, you have the right to:
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-medium text-white">Right of access</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Obtain a copy of your personal information we hold
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-medium text-white">Right of rectification</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Correct inaccurate or incomplete information
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-medium text-white">Right to erasure</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Request deletion of your data (right to be forgotten)
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <h3 className="font-medium text-white">Right to portability</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Receive your data in a structured and readable format
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
                <h3 className="text-lg font-semibold text-white">
                  How to submit a request
                </h3>
                <p className="mt-2 text-muted-foreground">
                  To exercise one of these rights, email our privacy officer:
                </p>
                <div className="mt-4">
                  <Button asChild size="lg">
                    <a href="mailto:privacy@solutionsimpactweb.com">
                      <Mail className="mr-2 h-5 w-5" />
                      privacy@solutionsimpactweb.com
                    </a>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Please include in your request:
                </p>
                <ul className="mt-2 list-disc pl-6 text-sm text-muted-foreground">
                  <li>Your full name</li>
                  <li>An email address to contact you</li>
                  <li>The type of request (access, rectification, deletion, etc.)</li>
                  <li>Any information that can identify you in our systems (e.g., email used at signup)</li>
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">
                  Processing time
                </h3>
                <p className="mt-2 text-muted-foreground">
                  In accordance with Law 25, we will process your request within
                  <strong> 30 days</strong> of receipt. If we need additional
                  time, we will let you know.
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">
                  Appeal to the CAI
                </h3>
                <p className="mt-2 text-muted-foreground">
                  If you are not satisfied with our response, you can file a
                  complaint with the Commission d&apos;acces a l&apos;information (CAI)
                  of Quebec:
                </p>
                <p className="mt-2 text-muted-foreground">
                  <a
                    href="https://www.cai.gouv.qc.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.cai.gouv.qc.ca
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Loi 25</span>
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-5xl">
            Demande d&apos;Accès aux Données
          </h1>
          <p className="mt-4 text-muted-foreground">
            Exercez vos droits en vertu de la Loi 25 et de la LPRPDE
          </p>
        </div>

        <Card className="mt-12 glass">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-white">Vos droits</h2>
            <p className="mt-2 text-muted-foreground">
              Conformément à la Loi 25 du Québec, vous avez le droit de:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-white">Droit d&apos;accès</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Obtenir une copie de vos renseignements personnels que nous
                  détenons
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-white">
                  Droit de rectification
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Corriger des renseignements inexacts ou incomplets
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-white">
                  Droit à l&apos;effacement
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Demander la suppression de vos données (droit à l&apos;oubli)
                </p>
              </div>
              <div className="rounded-lg border border-border p-4">
                <h3 className="font-medium text-white">
                  Droit à la portabilité
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recevoir vos données dans un format structuré et lisible
                </p>
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-primary/30 bg-primary/10 p-6">
              <h3 className="text-lg font-semibold text-white">
                Comment soumettre une demande
              </h3>
              <p className="mt-2 text-muted-foreground">
                Pour exercer l&apos;un de ces droits, envoyez un courriel à
                notre responsable de la protection des renseignements
                personnels:
              </p>
              <div className="mt-4">
                <Button asChild size="lg">
                  <a href="mailto:privacy@solutionsimpactweb.com">
                    <Mail className="mr-2 h-5 w-5" />
                    privacy@solutionsimpactweb.com
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Veuillez inclure dans votre demande:
              </p>
              <ul className="mt-2 list-disc pl-6 text-sm text-muted-foreground">
                <li>Votre nom complet</li>
                <li>Une adresse courriel pour vous contacter</li>
                <li>
                  Le type de demande (accès, rectification, suppression, etc.)
                </li>
                <li>
                  Toute information permettant de vous identifier dans nos
                  systèmes (ex: adresse courriel utilisée lors de
                  l&apos;inscription)
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white">
                Délai de traitement
              </h3>
              <p className="mt-2 text-muted-foreground">
                Conformément à la Loi 25, nous traiterons votre demande dans un
                délai de <strong>30 jours</strong> suivant sa réception. Si nous
                avons besoin de temps supplémentaire, nous vous en informerons.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white">
                Recours auprès de la CAI
              </h3>
              <p className="mt-2 text-muted-foreground">
                Si vous n&apos;êtes pas satisfait de notre réponse, vous pouvez
                porter plainte auprès de la Commission d&apos;accès à
                l&apos;information du Québec (CAI):
              </p>
              <p className="mt-2 text-muted-foreground">
                <a
                  href="https://www.cai.gouv.qc.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  www.cai.gouv.qc.ca
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
