import type { Metadata } from "next";
import { display, mono } from "./fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import ThemeProvider from "@/components/theme/ThemeProvider";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xenturylens — Product engineering studio",
  description: "Software built to last a hundred years.",
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
