import type { Metadata } from "next";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { Suspense } from "react";
import { CSSHealthCheck } from "@/components/CSSHealthCheck";

export const metadata: Metadata = {
  title: "Synastry — Celestial Compatibility",
  description: "Discover your cosmic connection through astrology, numerology, and ancient wisdom.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen m-0 p-0">
        {children}
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <CSSHealthCheck />
      </body>
    </html>
  );
}
