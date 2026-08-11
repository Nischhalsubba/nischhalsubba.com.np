/**
 * @fileoverview src/app/layout.tsx
 * Purpose: Own the authored layout source for this repository.
 * Responsibilities:
 * - Keep this file focused on its stated responsibility and stable public/build interfaces.
 * - Update connected owners whenever this file changes a shared contract.
 * Execution context: TypeScript source consumed by build/runtime tooling.
 * Connected files:
 * - src/app/design-system.css
 * - README.md
 * Maintenance: Keep this description synchronized with behavior and dependency changes; document generated code at its generator rather than editing generated output.
 */
import type { Metadata, Viewport } from "next";
import { Inter, Nunito_Sans } from "next/font/google";
import AppTelemetry from "@/components/AppTelemetry";
import { absoluteUrl, getGameJsonLd, SEO_KEYWORDS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/seo";
import "./globals.css";
import "./design-system.css";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-body" });
const nunitoSans = Nunito_Sans({ subsets: ["latin"], display: "swap", variable: "--font-display" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: "Nischhal Subba" }],
  creator: "Nischhal Subba",
  publisher: "Nischhal Subba",
  category: "game",
  manifest: "/manifest.json",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Blink & Find scattered number memory game board",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.svg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#f7faff",
};

/**
 * Root layout for the entire app.
 */


/**
 * Function contract: RootLayout
 * Purpose: Implement the root layout responsibility owned by the layout module.
 * Inputs: `{ children }`
 * Side effects: No direct external side effect beyond invoked dependencies.
 * Returns: Computed result consumed by the caller; explicit early-return branches define fallback behavior.
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${nunitoSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getGameJsonLd()) }}
        />
        <AppTelemetry />
        {children}
      </body>
    </html>
  );
}
