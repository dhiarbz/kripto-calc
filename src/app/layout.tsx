import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font"; // Using the official Geist package
import { Providers } from "@/components/Provider";
import "./globals.css";

// Predefined font variables (no runtime loading)
const fontVariables = `${GeistSans.variable} ${GeistMono.variable}`;

export const metadata: Metadata = {
  title: {
    default: "CryptoCalc - Professional Trading Calculator Tools",
    template: "%s | CryptoCalc" // For dynamic title segments
  },
  description: "Master your crypto trading with professional calculator tools. Convert crypto to rupiah, calculate position sizes, analyze gains/losses, and ROI for mining & staking.",
  metadataBase: new URL("https://cryptocalc.example.com"), // Replace with your actual domain
  authors: [{ name: "CryptoCalc Team", url: "https://cryptocalc.example.com" }],
  keywords: [
    "crypto calculator", 
    "bitcoin converter", 
    "trading tools",
    "position size calculator",
    "ROI calculator",
    "mining calculator",
    "staking calculator",
    "crypto to rupiah"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },
  
  // Open Graph
  openGraph: {
    title: "CryptoCalc - Professional Trading Calculator Tools",
    description: "Master your crypto trading with professional calculator tools.",
    url: "https://cryptocalc.example.com",
    siteName: "CryptoCalc",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png", // Local OG image
        width: 1200,
        height: 630,
        alt: "CryptoCalc Tools Preview",
      },
    ],
  },
  
  // Twitter Cards
  twitter: {
    card: "summary_large_image",
    title: "CryptoCalc - Professional Trading Calculator Tools",
    description: "Master your crypto trading with professional calculator tools.",
    creator: "@cryptocalc",
    images: ["/twitter-image.png"], // Local Twitter image
  },
  
  // Additional SEO
  alternates: {
    canonical: "https://cryptocalc.example.com",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontVariables} bg-background text-foreground antialiased`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}