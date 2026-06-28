import { Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";

export const display = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});
