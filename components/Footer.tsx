"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("company");

  return (
    <footer className="border-t border-border bg-card/30">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-primary">
                  {tc("name")}
                </span>
                <span className="text-lg font-bold text-white">
                  Loi 25 Radar
                </span>
              </div>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              {tc("division")}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{t("description")}</p>

            <div className="mt-6 space-y-2">
              <a
                href={`mailto:${tc("email")}`}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Mail className="h-4 w-4" />
                {tc("email")}
              </a>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                {tc("phone")}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {tc("address")}
              </p>
            </div>
          </div>

          {/* Legal Pages */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("legalPages")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/#audit"
                  className="text-sm text-white hover:text-primary"
                >
                  {t("complianceCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white hover:text-primary"
                >
                  {t("bottomLinks.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-white hover:text-primary"
                >
                  {t("cookiePolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/data-request"
                  className="text-sm text-white hover:text-primary"
                >
                  {t("dataRequest")}
                </Link>
              </li>
              <li>
                <Link
                  href="/#audit"
                  className="text-sm text-white hover:text-primary"
                >
                  {t("auditHeatmap")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Compliance */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {t("compliance")}
            </h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <span className="font-medium text-white">
                    {t("loi25.title")}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {t("loi25.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-secondary" />
                <div>
                  <span className="font-medium text-white">
                    {t("pipeda.title")}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {t("pipeda.description")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-400" />
                <div>
                  <span className="font-medium text-white">
                    {t("consent.title")}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {t("consent.description")}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {t("preferencesNote")}
              </p>
              <button className="mt-2 rounded-full border border-primary/50 px-4 py-2 text-sm text-primary transition-all hover:bg-primary/10">
                {t("preferencesButton")}
              </button>
            </div>
          </div>
        </div>

        {/* Privacy Officer Info - Law 25 Compliant */}
        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-white">
              {tc("responsible.title")} :
            </span>{" "}
            {tc("responsible.name")} —{" "}
            <a
              href={`mailto:${tc("responsible.email")}`}
              className="text-primary hover:underline"
            >
              {tc("responsible.email")}
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">{t("copyright")}</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-white"
            >
              {t("bottomLinks.privacy")}
            </Link>
            <Link
              href="/cookies"
              className="text-sm text-muted-foreground hover:text-white"
            >
              {t("bottomLinks.cookies")}
            </Link>
            <Link
              href="/data-request"
              className="text-sm text-muted-foreground hover:text-white"
            >
              {t("bottomLinks.dataRequests")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}