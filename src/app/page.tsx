// app/page.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Market from "@/components/Market";
import ToolsSection from "@/components/Tools";
import Footer from "@/components/Footer";

export const metadata = {
  title: "KriptoCalc - Kalkulator Kripto Indonesia",
  description:
    "KriptoCalc adalah kalkulator kripto lengkap dengan fitur konverter kripto, kalkulator untung rugi, kalkulator ukuran posisi, dan kalkulator DCA untuk membantu strategi trading kripto Anda.",
  keywords:
    "kalkulator kripto, konverter kripto, kalkulator untung rugi, kalkulator posisi, kalkulator DCA, KriptoCalc",
  authors: [{ name: "KriptoCalc Team" }],
  robots: "index, follow",
  openGraph: {
    title: "KriptoCalc - Kalkulator Kripto Lengkap",
    description:
      "KriptoCalc membantu trader dan investor menghitung konversi kripto, untung rugi, ukuran posisi, dan strategi DCA.",
    type: "website",
    url: "https://kriptocalc.com/",
    images: [
      {
        url: "https://kriptocalc.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KriptoCalc - Kalkulator Kripto Lengkap",
      },
    ],
  },
  alternates: {
    canonical: "https://kriptocalc.com/",
  },
};

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Market />
      <ToolsSection />
      <Footer />
    </div>
  );
}
