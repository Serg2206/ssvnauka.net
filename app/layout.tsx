import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { siteUrl } from "@/lib/site-data";
import "./globals.css";

const bodyFont = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-body", display: "swap" });
const displayFont = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ssvnauka.com",
    template: "%s | ssvnauka.com"
  },
  description: "Personalized surgical care, consultation intake, and service pages for Prof. Sergiy Valentinovich Sushkov.",
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
      </body>
    </html>
  );
}
