import type { Metadata, Viewport } from "next";
import { Playfair_Display, IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { BookingProvider } from "@/lib/context";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});
const impact = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-impact",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0A0A0A",
};

export const metadata: Metadata = {
  title: "MAD GODOWN BKK 26 — Ladderice × Nike Football",
  description: "Songwat. June 11–21, 2026. A controlled chaos marketplace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable} ${impact.variable}`}>
      <body>
        <div className="field-glow" />
        <div className="scanlines" />
        <BookingProvider>
          <main className="relative z-10 min-h-screen mx-auto max-w-[440px] pb-32">
            {children}
          </main>
        </BookingProvider>
        <div className="grain" />
      </body>
    </html>
  );
}
