"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Icons
import { 
  DollarSign, Loader2, TrendingUp, TrendingDown, RefreshCw, 
  CandlestickChart, Target, BarChart3, Calendar 
} from "lucide-react";

// Types
interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  image: string;
  price_change_percentage_24h: number;
}

interface DCAResult {
  totalInvestment: number;
  profitLoss: number;
  totalTokens: number;
  averagePrice: number;
  currentValue: number;
  profitLossPercentage: number;
  purchases: DCAPurchase[];
  numberOfPurchases: number;
}

interface DCAPurchase {
  date: string;
  amountInvested: number;
  tokensPurchased: number;
  pricePerToken: number;
}

const fetchCryptoData = async (): Promise<CryptoData[]> => {
  const { data } = await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
    params: {
      vs_currency: "idr",
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
      sparkline: false,
      price_change_percentage: "24h"
    }
  });
  return data;
};

const DCA = () => {
  // State
  const [selectedCrypto, setSelectedCrypto] = useState<string>("bitcoin");
  const [investmentAmount, setInvestmentAmount] = useState<string>("100000");
  const [investmentFrequency, setInvestmentFrequency] = useState<string>("12");
  const [investmentInterval, setInvestmentInterval] = useState<string>("daily");
  const [investmentStartDate, setInvestmentStartDate] = useState<string>("");
  const [investmentResult, setInvestmentResult] = useState<DCAResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Fetch crypto data
  const { data: cryptoList, isLoading: isCryptoLoading, error } = useQuery<CryptoData[]>({
    queryKey: ['cryptoList'],
    queryFn: fetchCryptoData,
    staleTime: 1000 * 60 * 5,
  });

  // Constants
  const investmentFrequencyOptions = [
    { value: "daily", label: "Harian", days: 1 },
    { value: "weekly", label: "Mingguan", days: 7 },
    { value: "monthly", label: "Bulanan", days: 30 },
    { value: "yearly", label: "Tahunan", days: 365 }
  ];

  // Effects
  useEffect(() => {
    if (error) {
      toast.error("Gagal mengambil data cryptocurrency. Silakan coba lagi.");
    }
  }, [error]);

  useEffect(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    setInvestmentStartDate(oneYearAgo.toISOString().split("T")[0]);
  }, []);

  // Memoized values
  const selectedCryptoData = useMemo(() => {
    return cryptoList?.find(crypto => crypto.id === selectedCrypto);
  }, [cryptoList, selectedCrypto]);

  // Handlers
  const calculateDCA = () => {
    setIsLoading(true);
    setInvestmentResult(null);

    const amount = parseFloat(investmentAmount);
    const months = parseFloat(investmentFrequency);

    if (!selectedCryptoData || isNaN(amount) || isNaN(months) || amount <= 0 || months <= 0) {
      toast.error("Jumlah investasi dan frekuensi harus berupa angka positif.");
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      const purchases: DCAPurchase[] = [];
      let totalInvestment = 0;
      let totalTokens = 0;

      const intervalConfig = investmentFrequencyOptions.find(option => option.value === investmentInterval);
      if (!intervalConfig) {
        toast.error("Interval investasi tidak valid.");
        setIsLoading(false);
        return;
      }

      const totalDays = months * 30;
      const purchaseInterval = intervalConfig.days;
      const currentPrice = selectedCryptoData.current_price;
      const numberOfPurchases = Math.floor(totalDays / purchaseInterval);

      for (let i = 0; i < numberOfPurchases; i++) {
        const purchaseDate = new Date(investmentStartDate);
        purchaseDate.setDate(purchaseDate.getDate() + (i * purchaseInterval));

        const priceVariation = 0.8 + Math.random() * 0.4;
        const simulatedPrice = currentPrice * priceVariation;
        const tokensPurchased = amount / simulatedPrice;

        purchases.push({
          date: purchaseDate.toLocaleDateString("id-ID"),
          amountInvested: amount,
          pricePerToken: simulatedPrice,
          tokensPurchased: tokensPurchased
        });

        totalInvestment += amount;
        totalTokens += tokensPurchased;
      }

      const averagePrice = totalInvestment / totalTokens;
      const currentValue = totalTokens * currentPrice;
      const profitLoss = currentValue - totalInvestment;
      const profitLossPercentage = (profitLoss / totalInvestment) * 100;

      const dcaResult: DCAResult = {
        totalInvestment,
        currentValue,
        profitLoss,
        totalTokens,
        averagePrice,
        numberOfPurchases,
        profitLossPercentage,
        purchases: purchases.slice(-5)
      };

      setInvestmentResult(dcaResult);

      if (profitLoss > 0) {
        toast.success(`Keuntungan: Rp ${profitLoss.toLocaleString("id-ID")} (${profitLossPercentage.toFixed(2)}%)`);
      } else if (profitLoss < 0) {
        toast.error(`Kerugian: Rp ${Math.abs(profitLoss).toLocaleString("id-ID")} (${profitLossPercentage.toFixed(2)}%)`);
      } else {
        toast.info("Tidak ada keuntungan atau kerugian.");
      }

      setIsLoading(false);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedCrypto("bitcoin");
    setInvestmentAmount("100000");
    setInvestmentFrequency("12");
    setInvestmentInterval("daily");
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    setInvestmentStartDate(oneYearAgo.toISOString().split("T")[0]);
    setInvestmentResult(null);
    toast.success("Kalkulator telah direset.");
  };

  // Formatters
  const formatCurrency = (value: number) => {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatNumber = (value: number, decimals = 6) => {
    return value.toLocaleString("id-ID", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Kalkulator DCA</h1>
            <p className="text-muted-foreground text-lg">
              Hitung strategi Dollar-Cost Averaging untuk investasi cryptocurrency Anda
            </p>
          </div>

          {/* Input Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CandlestickChart className="h-6 w-6 text-primary" />
                Pengaturan Investasi
              </CardTitle>
              <CardDescription>
                Masukkan detail investasi Anda untuk menghitung strategi DCA
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Crypto Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crypto-select">Pilih Cryptocurrency</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger id="crypto-select">
                      <SelectValue placeholder="Pilih cryptocurrency" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoList?.map(crypto => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          <div className="flex items-center gap-2">
                            <img src={crypto.image} alt={crypto.name} className="w-6 h-6 rounded-full" />
                            <span className="text-sm font-medium">
                              {crypto.name} ({crypto.symbol.toUpperCase()})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedCryptoData && (
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Harga saat ini: {formatCurrency(selectedCryptoData.current_price)}</span>
                      <div className={`flex items-center gap-1 ${
                        selectedCryptoData.price_change_percentage_24h >= 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {selectedCryptoData.price_change_percentage_24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(selectedCryptoData.price_change_percentage_24h).toFixed(2)}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Investment Amount */}
                <div className="space-y-2">
                  <Label htmlFor="investment-amount">Jumlah Investasi (IDR)</Label>
                  <Input
                    id="investment-amount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="100000"
                    min="100000"
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum: Rp 100.000 per investasi
                  </p>
                </div>
              </div>

              {/* Frequency and Interval */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investment-frequency">Durasi Investasi (bulan)</Label>
                  <Input
                    id="investment-frequency"
                    type="number"
                    value={investmentFrequency}
                    onChange={(e) => setInvestmentFrequency(e.target.value)}
                    placeholder="12"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="investment-interval">Interval Investasi</Label>
                  <Select value={investmentInterval} onValueChange={setInvestmentInterval}>
                    <SelectTrigger id="investment-interval">
                      <SelectValue placeholder="Pilih interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {investmentFrequencyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date and Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="investment-start-date">Tanggal Mulai Investasi</Label>
                  <Input
                    id="investment-start-date"
                    type="date"
                    value={investmentStartDate}
                    onChange={(e) => setInvestmentStartDate(e.target.value)}
                    min="2020-01-01"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="flex items-end justify-end gap-2">
                  <Button variant="outline" onClick={handleReset} className="flex-1 sm:flex-none">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    onClick={calculateDCA} 
                    disabled={isLoading || isCryptoLoading}
                    className="flex-1 sm:flex-none"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <TrendingUp className="mr-2 h-4 w-4" />
                    )}
                    Hitung DCA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          {investmentResult && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard
                  title="Total Investasi"
                  value={formatCurrency(investmentResult.totalInvestment)}
                  subtitle={`${investmentResult.numberOfPurchases} kali pembelian`}
                  icon={DollarSign}
                  iconColor="text-blue-600"
                  bgColor="bg-blue-50"
                  borderColor="border-blue-200"
                />

                <SummaryCard
                  title="Total Token"
                  value={formatNumber(investmentResult.totalTokens)}
                  subtitle={selectedCryptoData?.symbol.toUpperCase() || ''}
                  icon={Target}
                  iconColor="text-purple-600"
                  bgColor="bg-purple-50"
                  borderColor="border-purple-200"
                />

                <SummaryCard
                  title="Harga Rata-rata"
                  value={formatCurrency(investmentResult.averagePrice)}
                  subtitle={`per ${selectedCryptoData?.symbol.toUpperCase()}`}
                  icon={BarChart3}
                  iconColor="text-orange-600"
                  bgColor="bg-orange-50"
                  borderColor="border-orange-200"
                />

                <SummaryCard
                  title={investmentResult.profitLoss >= 0 ? 'Keuntungan' : 'Kerugian'}
                  value={formatCurrency(Math.abs(investmentResult.profitLoss))}
                  subtitle={`${investmentResult.profitLoss >= 0 ? '+' : '-'}${Math.abs(investmentResult.profitLossPercentage).toFixed(2)}%`}
                  icon={investmentResult.profitLoss >= 0 ? TrendingUp : TrendingDown}
                  iconColor={investmentResult.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}
                  bgColor={investmentResult.profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'}
                  borderColor={investmentResult.profitLoss >= 0 ? 'border-green-200' : 'border-red-200'}
                />
              </div>

              {/* Current Value Card */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Nilai Investasi Saat Ini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 break-all">
                      {formatCurrency(investmentResult.currentValue)}
                    </div>
                    <div className={`text-base md:text-lg ${investmentResult.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {investmentResult.profitLoss >= 0 ? 'Keuntungan' : 'Kerugian'}: {formatCurrency(Math.abs(investmentResult.profitLoss))}
                      ({investmentResult.profitLoss >= 0 ? '+' : '-'}{Math.abs(investmentResult.profitLossPercentage).toFixed(2)}%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Helper Component for Summary Cards
const SummaryCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  bgColor, 
  borderColor,
  isLargeNumber = false,
  isSmallNumber = false
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  isLargeNumber?: boolean;
  isSmallNumber?: boolean;
}) => (
 <Card className={`${borderColor} ${bgColor}`}>
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${iconColor}`} />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className={`font-bold mb-1 break-all ${
        isLargeNumber ? 'text-xl' : 
        isSmallNumber ? 'text-sm' : 
        'text-sm'
      }`}>
        {value}
      </div>
      <div className="text-xs opacity-75">{subtitle}</div>
    </CardContent>
  </Card>
);

export default DCA;