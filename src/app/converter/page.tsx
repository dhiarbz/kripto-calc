"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, Loader2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query"; 
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Konverter Mata Uang Kripto - CryptoCalc",
  description: "Konverter Mata Uang Kripto gratis yang memungkinkan Anda mengonversi antara berbagai mata uang kripto dan fiat dengan data harga real-time.",
  keywords: ["konverter kripto", "konverter mata uang", "crypto to fiat", "crypto converter", "cryptocurrency converter", "kripto ke rupiah", "crypto to IDR"],
  authors: [{ name: "Kripto Calc", url: "https://kripto-calc.vercel.app" }],
  openGraph: {
    title: "Konverter Mata Uang Kripto -CryptoCalc",
    description: "Konverter Mata Uang Kripto gratis yang memungkinkan Anda mengonversi antara berbagai mata uang kripto dan fiat dengan data harga real-time.",
    url: "https://kripto-calc.vercel.app/converter",
    siteName: "Kripto Calc",
    images: [
      {
        url: "https://kripto-calc.vercel.app/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "Konverter Mata Uang Kripto - CryptoCalc",
      }
    ],
    locale: "id_ID",
    type: "website",
  },
  robots : {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  }
  
}

// Tipe data tetap sama
interface CurrencyData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const fetchCurrencies = async (): Promise<CurrencyData[]> => {
  const { data } = await axios.get(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: {
        vs_currency: "idr", // Tetap ambil base dalam IDR
        order: "market_cap_desc",
        per_page: 50, // Ambil lebih banyak untuk pilihan
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    }
  );
  return data;
};

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 5) return "baru saja";
  if (seconds < 60) return `${seconds} detik yang lalu`;  
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit yang lalu`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam yang lalu`;
  return new Date(timestamp).toLocaleDateString("id-ID");
}

const Converter = () => {
  // 1. Tambah state untuk mata uang sumber dan tujuan
  const [sourceCurrency, setSourceCurrency] = useState<string>("bitcoin"); // Default Bitcoin
  const [targetCurrency, setTargetCurrency] = useState<string>("usd-coin"); // Default USDC
  const [sourceAmount, setSourceAmount] = useState<string>("1");
  const [targetAmount, setTargetAmount] = useState<number>(0);

  const { data: currencyList = [], isLoading, isError, refetch, dataUpdatedAt, isFetching } = useQuery({
    queryKey: ["currencyMarkets"],
    queryFn: fetchCurrencies,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Gagal mengambil data mata uang.");
    }
  }, [isError]);

  const targetCurrencyOptions = useMemo(() => {
    const idrOption = { id: 'idr', name: 'Indonesian Rupiah', symbol: 'idr', image: '/assets/indonesia.png', current_price: 1, price_change_percentage_24h: 0 }; // Ganti dengan gambar bendera jika ada
    return [idrOption, ...currencyList];
  }, [currencyList]);

  const sourceData = useMemo(() => {
    return currencyList.find(c => c.id === sourceCurrency);
  }, [currencyList, sourceCurrency]);

  const targetData = useMemo(() => {
    // Tambahkan Rupiah secara manual sebagai pilihan
    return targetCurrencyOptions.find(c => c.id === targetCurrency);
  }, [targetCurrencyOptions, targetCurrency]);
  
  // Kalkulasi otomatis
  useEffect(() => {
    if (sourceData && targetData && sourceAmount) {
      const amount = parseFloat(sourceAmount);
      if (!isNaN(amount)) {
        const valueInIdr = amount * sourceData.current_price;
        const finalAmount = valueInIdr / targetData.current_price;
        setTargetAmount(finalAmount);
      }
    } else {
      setTargetAmount(0);
    }
  }, [sourceAmount, sourceData, targetData]);

  // Fungsi untuk menukar mata uang
  const handleSwap = () => {
    if (targetCurrency === 'idr'){
      toast.error("Tidak dapat menukar dengan Rupiah secara langsung.");
      return;
    }
    const tempSource = sourceCurrency;
    setSourceCurrency(targetCurrency);
    setTargetCurrency(tempSource);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Konverter Mata Uang Kripto
            </h1>
          </div>
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5 text-primary" />
                    Konverter Mata Uang
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">
                      Data oleh CoinGecko diperbarui: {dataUpdatedAt ? formatTimeAgo(dataUpdatedAt) : "Memuat..."} 
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => refetch()}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Muat Ulang
                    </Button>
                  </div> 
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Memuat data kripto...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    {/* Source Currency Input */}
                    <div className="space-y-2">
                      <Label htmlFor="source-amount">Dari</Label>
                      <div className="flex gap-2">
                        <Input
                          id="source-amount"
                          type="number"
                          value={sourceAmount}
                          onChange={(e) => setSourceAmount(e.target.value)}
                        />
                        <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Pilih Koin" />
                          </SelectTrigger>
                          <SelectContent>
                            {currencyList.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                <div className="flex items-center gap-2">
                                  <img src={c.image} alt={c.name} className="w-5 h-5" />
                                  <span>{c.symbol.toUpperCase()}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Target Currency Input */}
                    <div className="space-y-2">
                      <Label htmlFor="target-currency">Ke</Label>
                      <div className="flex gap-2">
                         <Input id="target-amount" type="number" value={targetAmount.toFixed(6)} readOnly />
                         <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Pilih Koin" />
                          </SelectTrigger>
                          <SelectContent>
                            {targetCurrencyOptions.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                <div className="flex items-center gap-2">
                                  <img src={c.image} alt={c.name} className="w-5 h-5" />
                                  <span>{c.symbol.toUpperCase()}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button variant="ghost" size="icon" onClick={handleSwap}>
                        <ArrowUpDown className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* 3. Tampilkan hasil konversi yang dinamis */}
                  {targetAmount > 0 && sourceData && targetData && (
                    <div className="mt-4 p-4 bg-accent rounded-lg text-center">
                      <p className="text-muted-foreground">
                        1 {sourceData.symbol.toUpperCase()} = { (sourceData.current_price / targetData.current_price).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) } {targetData.symbol.toUpperCase()}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-2">
                        {parseFloat(sourceAmount).toLocaleString('id-ID')} {sourceData.symbol.toUpperCase()} ≈ {targetAmount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} {targetData.symbol.toUpperCase()}
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          {/* ... Popular Cryptocurrencies Section ... */}
           {!isLoading && currencyList.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Popular Cryptocurrencies</CardTitle>
                <CardDescription>
                  Current prices in Indonesian Rupiah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currencyList.slice(0, 9).map((crypto) => (
                    <div 
                      key={crypto.id}
                      className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      onClick={() => {
                        setSourceCurrency(crypto.id);
                        setSourceAmount("1");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={crypto.image} 
                          alt={crypto.name} 
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {crypto.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {crypto.symbol.toUpperCase()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">
                            Rp {crypto.current_price.toLocaleString('id-ID')}
                          </p>
                          <div className={`flex items-center justify-end gap-1 text-xs ${
                            crypto.price_change_percentage_24h >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {crypto.price_change_percentage_24h >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            <span>
                              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Converter;