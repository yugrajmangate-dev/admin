import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import { AuthBootstrap } from "@/components/auth-bootstrap";
import { GlobalLayoutWrapper } from "@/components/global-layout-wrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DineUp — Hyper-local dining, reimagined.",
  description:
    "Discover design-forward restaurants, track them on a live map, and book tables with Baymax, your AI gastronomy assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} bg-gray-50 font-sans text-slate-900 antialiased`}
        suppressHydrationWarning
      >
        <AuthBootstrap />
        <GlobalLayoutWrapper>
          {children}
        </GlobalLayoutWrapper>
      </body>
    </html>
  );
}
