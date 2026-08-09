import type { Metadata } from "next";
import "./globals.css";
import { getSiteUrl } from "./site-config";

const title = "Titan Elektroinstalacije | Crna Gora";
const description =
  "Električarske usluge u Crnoj Gori — rasvjeta, montaža, renoviranje, adaptacije i instalacije jake i slabe struje.";
const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title,
  description,
  applicationName: "Titan Elektroinstalacije",
  keywords: [
    "električar Crna Gora",
    "elektroinstalacije",
    "rasvjeta",
    "jaka struja",
    "slaba struja",
    "Titan",
  ],
  alternates: siteUrl ? { canonical: "/" } : undefined,
  robots: siteUrl
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  openGraph: {
    type: "website",
    locale: "sr_ME",
    siteName: "Titan Elektroinstalacije",
    title,
    description,
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="sr-Latn">
      <body>{children}</body>
    </html>
  );
}
