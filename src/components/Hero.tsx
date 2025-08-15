"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Shield, Zap, Loader2, TrendingDown } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface CryptoData{
  id: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

const fetchCryptoData = async (): Promise<CryptoData[]> => {
  const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
    params: {
      vs_currency: "idr",
      ids: "bitcoin,ethereum", 
      order: "market_cap_desc",
      per_page: 2,
      page: 1,
      sparkline: false,
    },
  });
  return data;
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const Hero = () => {
  const { data: cryptoData, isLoading, isError } = useQuery<CryptoData[]>({
    queryKey: ["HerocryptoData"],
    queryFn: fetchCryptoData,
    staleTime: 60 * 1000 , 
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    if(isError){
    toast.error("Gagal memuat harga pasar");
  }
  }, [isError]);

    const totalMarketCap = cryptoData?.reduce((acc, coin) => acc + coin.market_cap, 0) || 0;


    return (
         <section id="home" className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/hero-trading.jpg" 
          alt="Trading Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-hero/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Trading Cerdas
                <span className="bg-primary bg-clip-text text-transparent"> Cuan Maksimal</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Hitung posisi ideal, analisis risiko pasar, dan tingkatkan potensi ROI Anda. 
                Semua alat yang Anda butuhkan dalam satu platform.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 bg-brand-accent/50 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Kalkulator ROI</span>
              </div>
              <div className="flex items-center space-x-2 bg-brand-accent/50 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Manajemen Resiko</span>
              </div>
              <div className="flex items-center space-x-2 bg-brand-accent/50 px-4 py-2 rounded-full">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Hasil Instan</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow"
              >
                Coba Kalkulator
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/30 text-foreground hover:bg-accent"
              >
                Lihat Demo
              </Button>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">50M+</div>
                <div className="text-sm text-muted-foreground">Calculations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
            </div> */}
          </div>

          {/* Visual Element */}
          <div className="relative lg:block hidden">
            <div className="relative w-full h-96 animate-slide-up">
              <div className="absolute inset-0 bg-card rounded-3xl shadow-card border border-border/50 backdrop-blur-sm">
                <div className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Harga Pasar Terkini</h3>
                    <div className="w-3 h-3 bg-primary rounded-full animate-bounce-gentle"></div>
                  </div>
                  
                  <div className="space-y-4">
                    {isLoading ? (
                    <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                    ) : isError || !cryptoData ? (
                      <div className="text-red-500">Gagal memuat data</div>
                    ) : (
                      <>
                        {cryptoData?.map((crypto) => (
                          <div key={crypto.id} className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                            <span className="text-muted-foreground">{crypto.symbol.toUpperCase()}/IDR</span>
                            <div className="flex flex-col items-end">
                              <span className="text-lg font-bold text-foreground">{formatCurrency(crypto.current_price)}</span>
                              <div className={`flex items-center text-xs font-semibold ${crypto.price_change_percentage_24h >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                {crypto.price_change_percentage_24h >= 0 ? (
                                  <TrendingUp className="w-4 h-4 mr-1" />
                                ) : (
                                  <TrendingDown className="w-4 h-4 mr-1 transform rotate-180" />
                                )}
                                <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
                              </div>
                            </div>
                          </div>
                        ))}
                          <div className="flex justify-between items-center p-3 bg-accent/50 rounded-lg">
                            <span className="text-muted-foreground">Kapitalisasi Pasar</span>
                            <span className="text-lg font-bold text-foreground">{formatCurrency(totalMarketCap || 0)}</span>
                          </div>
                      </>
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
    </section>
    );
};

export default Hero;