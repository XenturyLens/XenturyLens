import type { Metadata } from "next";
import { display, mono } from "./fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import ThemeProvider from "@/components/theme/ThemeProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://xenturylens.com"),
  title: {
    default: "Xenturylens — Product engineering studio",
    template: "%s · Xenturylens",
  },
  description: "Software built to last a hundred years.",
  openGraph: {
    title: "Xenturylens",
    description: "Software built to last a hundred years.",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <SiteHeader />
          <div className="pt-16">{children}</div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
