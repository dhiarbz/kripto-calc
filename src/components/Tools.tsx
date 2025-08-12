"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Calculator, TrendingUp, DollarSign, CandlestickChart } from "lucide-react";
import Link from "next/link"; // 1. Impor komponen Link

const ToolsSection = () => {
  const tools = [
    {
      icon: DollarSign,
      title: "Konverter Kripto ke Rupiah",
      description: "Konversi mata uang kripto apa pun ke Rupiah Indonesia dengan kurs real-time dan data historis.",
      features: ["Kurs real-time", "Berbagai jenis koin", "Grafik historis"],
      href: "/converter",
      color: "text-blue-600"
    },
    {
      icon: Calculator,
      title: "Kalkulator Ukuran Posisi (Position Size)",
      description: "Hitung ukuran posisi trading yang optimal berdasarkan toleransi risiko dan saldo akun Anda untuk manajemen risiko yang lebih baik.",
      features: ["Persentase risiko", "Level stop loss", "Saldo akun"],
      href: "/position-size",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Kalkulator Keuntungan & Kerugian",
      description: "Analisis performa trading Anda dengan perhitungan keuntungan/kerugian yang detail dan persentase imbal hasil.",
      features: ["Analisis P&L", "Persentase imbal hasil", "Perhitungan biaya"],
      href: "/gain-loss",
      color: "text-emerald-600"
    },
    {
      icon: CandlestickChart, 
      title: "Kalkulator DCA (Dollar-Cost Averaging)",
      description: "Simulasikan hasil investasi rutin Anda dan lihat bagaimana harga beli rata-rata terbentuk seiring waktu untuk mengoptimalkan strategi cicil aset.",
      features: ["Jumlah investasi per periode", "Interval waktu", "Total durasi investasi"],
      href: "/dca-calculator",
      color: "text-blue-600"
    },
  ];

  return (
    <section id="tools" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Alat Kalkulator Trading
          </h2>
           <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
             Kalkulator tingkat profesional yang dirancang untuk trader dan investor kripto yang serius. 
             Buat keputusan berdasarkan informasi dengan perhitungan yang akurat dan data real-time.
           </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.title}
                className="group hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2 bg-card border-border/50 animate-fade-in flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-primary/10 ${tool.color} group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {tool.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 flex flex-col flex-grow mt-auto pt-0">
                  {/* Features */}
                  <div className="space-y-2 flex-grow">
                    <h4 className="text-sm font-semibold text-foreground tracking-wide">Fitur Utama</h4>
                    <div className="flex flex-wrap gap-2">
                      {tool.features.map((feature) => (
                        <span 
                          key={feature}
                          className="px-3 py-1 bg-accent text-accent-foreground text-sm rounded-full font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  {/* 2. Bungkus Button dengan Link dan tambahkan prop asChild */}
                  <Link href={tool.href} legacyBehavior passHref>
                    <Button 
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold group-hover:shadow-glow transition-all duration-300 mt-4"
                    >
                      <a>
                        Coba Kalkulator
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </a>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ToolsSection;