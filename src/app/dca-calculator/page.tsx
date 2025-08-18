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

interface cryptoData {
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
}

interface DCAPurchase {
    date: string;
    amountInvested: number;
    tokensPurchased: number;
    pricePerToken: number;
}

const fetchCryptoData = async () => {
    const {data}= await axios.get(`https://api.coingecko.com/api/v3/coins/markets`, {
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
    const [selectedCrypto, setSelectedCrypto] = useState<string>("bitcoin");
    const [investmentAmount, setInvestmentAmount] = useState<string>("100000");    
    const [investmentFrequency, setInvestmentFrequency] = useState<string>("12");
    const [investmentInterval, setInvestmentInterval] = useState<string>("harian");
    const [investmentStartDate, setInvestmentStartDate] = useState<string>("");

    const [investmentResult, setInvestmentResult] = useState<DCAResult | null>(null);
    const [isLoading, setisLoading] = useState<boolean>(false);

    const { data: cryptoList, isLoading: isCryptoLoading, error } = useQuery<cryptoData[]>({
        queryKey: ['cryptoList'],
        queryFn: fetchCryptoData,
        staleTime: 1000 * 60 * 15, // 5 minutes
    });

    useEffect(() => {
        if (error) {
            toast.error("Gagal terjadi kesalahan saat mengambil data cryptocurrency. Silakan coba lagi.");
        }
    }, [error]);

    useMemo(() => {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        setInvestmentStartDate(oneYearAgo.toISOString().split("T")[0]);
    }, []);

    const selectedCryptoData = useMemo(() => {
        return cryptoList?.find(crypto => crypto.id === selectedCrypto);
    }, [cryptoList, selectedCrypto]);

    const investmentFrequencyOptions = [
        { value: "daily", label: "Harian", days: 1 },
        { value: "weekly", label: "Mingguan", days: 7 },
        { value: "monthly", label: "Bulanan", days: 30 },
        { value: "Year", label: "Tahunan", days: 365 }
    ]

    const calculateDCA = () => {
        setisLoading(true);
        setInvestmentResult(null);

        const amount = Number.parseFloat(investmentAmount);
        const months = Number.parseFloat(investmentFrequency);

        if (!selectedCryptoData || Number.isNaN(amount) || Number.isNaN(months) || amount <= 0 || months <= 0) {
            toast.error("Jumlah investasi dan frekuensi harus berupa angka positif.");
            setisLoading(false);
            return;
        }

        setTimeout(() => {
            const purchases: DCAPurchase[] = [];
            let totalInvestment = 0;
            let totalTokens = 0;
            
            const intervalDays = investmentFrequencyOptions.find(option => option.value === investmentInterval)!;
            const totalDays = months * 30;
            const purchaseInterval = intervalDays.days
            const current_price = selectedCryptoData.current_price;
            const numberOfPurchases = Math.floor(totalDays / purchaseInterval);

            for (let i = 0; i < numberOfPurchases; i++) {
                const purchaseDate = new Date(investmentStartDate);
                purchaseDate.setDate(purchaseDate.getDate() + (i * purchaseInterval));

                const priceVariation = 0.8 + Math.random() * 0.4; // Simulate price variation between 80% and 120%
                const simulatedPrice = current_price * priceVariation;

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
            const currentValue = totalTokens * current_price;
            const profitLoss = currentValue - totalInvestment;
            const profitLossPercentage = (profitLoss / totalInvestment) * 100;

            const dcaResult:DCAResult = {
                totalInvestment,
                currentValue,
                profitLoss,
                totalTokens,
                averagePrice,
                profitLossPercentage,
                purchases: purchases.slice(-10)
            }
            setInvestmentResult(dcaResult);
            if (profitLoss > 0) {
                toast.success(`Keuntungan: Rp ${profitLoss.toLocaleString("id-ID")} (${profitLossPercentage.toFixed(2)}%)`);
            }
            else if(profitLoss < 0) {
                toast.error(`Kerugian: Rp ${Math.abs(profitLoss).toLocaleString("id-ID")} (${profitLossPercentage.toFixed(2)}%)`);
            }
            else {
                toast.info("Tidak ada keuntungan atau kerugian.");
            }
            
            setisLoading(false);
        }, 1000);
    }

    const handleReset = () => {
        setSelectedCrypto("bitcoin");
        setInvestmentAmount("100000");
        setInvestmentFrequency("12");
        setInvestmentInterval("harian");
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        setInvestmentStartDate(oneYearAgo.toISOString().split("T")[0]);
        setInvestmentResult(null);
        toast.success("Calculator telah direset.");
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }
    const formatPercentage = (value: number, decimals = 6) => {
        return `${value >=0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    const formatNumber = (value: number, decimals = 2) => {
        return value.toLocaleString("id-ID", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
        <Header/>
            <main className="pt-20 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">                    
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold mb-4">DCA Calculator</h1>
                    <p className="text-muted-foreground mb-6">Hitung rata-rata biaya dollar (DCA) untuk investasi cryptocurrency Anda.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Pengaturan Investasi</CardTitle>
                        <CardDescription>Masukkan detail investasi Anda untuk menghitung DCA.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="crypto-select">Cryptocurrency</Label>
                                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                                    <SelectTrigger id="crypto-select">
                                        <SelectValue placeholder="Pilih Cryptocurrency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cryptoList?.map(crypto => (
                                            <SelectItem key={crypto.id} value={crypto.id}>
                                                {crypto.name} ({crypto.symbol.toUpperCase()})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="investment-amount">Jumlah Investasi (IDR)</Label>
                                <Input
                                    id="investment-amount"
                                    type="number"
                                    value={investmentAmount}
                                    onChange={(e) => setInvestmentAmount(e.target.value)}
                                    placeholder="100000"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="investment-frequency">Frekuensi Investasi (bulan)</Label>
                                <Input
                                    id="investment-frequency"
                                    type="number"
                                    value={investmentFrequency}
                                    onChange={(e) => setInvestmentFrequency(e.target.value)}
                                    placeholder="12"
                                />
                            </div>
                            <div>
                                <Label htmlFor="investment-interval">Interval Investasi</Label>
                                <Select value={investmentInterval} onValueChange={setInvestmentInterval}>
                                    <SelectTrigger id="investment-interval">
                                        <SelectValue placeholder="Pilih Interval" />
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
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
                            <div className="flex items-center justify-end">
                                <Button variant="outline" onClick={handleReset} className="mr-2">
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Reset
                                </Button>
                                <Button onClick={calculateDCA} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <TrendingUp className="mr-2 h-4 w-4" />}
                                    Hitung DCA
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            </main>
        <Footer/>
        </div>
    )
}
export default DCA;