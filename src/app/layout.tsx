import type { Metadata, Viewport } from "next";
import { Nunito, Pacifico } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#065F46",
};

export const metadata: Metadata = {
  title: "Pandas Waffle House 🐼 — Waffles, Bowls & Pan Cakes",
  description:
    "Pandas Waffle House serves freshly made Sandwich Waffles, Belgium Waffles, Bowl Cakes, and Pan Cakes. Order online or visit us — every bite is a panda hug! Fast home delivery available.",
  keywords: [
    "waffle house", "belgium waffle", "sandwich waffle", "bowl cake",
    "pan cake", "pandas waffle", "desserts", "oreo waffle", "nutella waffle",
    "waffle delivery", "fresh waffles", "panda chef", "bamboo points",
    "waffle bowl", "lava cake", "waffles near me",
  ],
  authors: [{ name: "Pandas Waffle House" }],
  creator: "Pandas Waffle House",
  publisher: "Pandas Waffle House",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Pandas Waffle House 🐼 — Fresh Waffles Delivered Hot",
    description: "Order fresh Belgium waffles, bowl cakes, sandwich waffles & pan cakes online! Fast home delivery. Earn 10 Bamboo Points per ₹100.",
    type: "website",
    locale: "en_IN",
    siteName: "Pandas Waffle House",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pandas Waffle House 🐼 — Waffles Delivered Hot",
    description: "Fresh waffles, bowls & pan cakes — made with love by Panda Chef Bam-Bam. Fast home delivery!",
  },
};

type LayoutProps<T extends string> = {
  children: React.ReactNode;
  params?: Promise<Record<T extends `${string}[${infer P}]${string}` ? P : never, string>>;
};

import GlobalPandaAd from "@/components/GlobalPandaAd";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${pacifico.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <GlobalPandaAd />
      </body>
    </html>
  );
}
