"use client";

import { useState, useEffect, useMemo, use } from "react";
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
    market_cap: number;
    price_change_percentage_24h: number;
    image: string;
}

interface PositionSizeResult {
    riskAmount: number;
    positionSizeAsset: number;
    positionSizeRupiah: number;
    assetSymbol: string;
}   
const fetchCryptoData = async (): Promise<cryptoData[]> => {
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
            vs_currency: "idr",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: "24h",
        },
    });
    return data;
};

const positionSize = () => {  
    const [accountBalance, setAccountBalance] = useState<string>("1000000");
    const [riskPercentage, setRiskPercentage] = useState<string>("1");
    const [stopLossPrice, setStopLossPrice] = useState<string>("0");  
    const [entryPrice, setEntryPrice] = useState<string>("0");
    const [selectedCrypto, setSelectedCrypto] = useState<string>("bitcoin");

    const [result, setResult] = useState<PositionSizeResult | null>(null);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    
    const { data: cryptoData = [], isLoading, isError } = useQuery<cryptoData[]>({
        queryKey: ["cryptoData"],
        queryFn: fetchCryptoData,
        staleTime: 1000 * 60 * 15, // 15 menit
        refetchInterval: 1000 * 60 * 15, // 15 menit
    });

    useEffect(() => {
        if (isError) {
            toast.error("Gagal memuat data kripto");
        }
    }, [isError]);

    const selectCryptoOptions = useMemo(() => {
        return cryptoData?.find(crypto => crypto.id === selectedCrypto);
    }, [selectedCrypto,cryptoData]);

    useEffect(() => {
        if (selectCryptoOptions) {
            setEntryPrice(selectCryptoOptions.current_price.toString());
            setResult(null); // Default stop loss 5% di bawah harga masuk
        }
    }, [selectCryptoOptions]);

    const handleCalculate = () => {
        setIsCalculating(true);
        setResult(null);

        const balance = parseFloat(accountBalance);
        const riskPercent = parseFloat(riskPercentage);
        const stopLoss = parseFloat(stopLossPrice);
        const entry = parseFloat(entryPrice);

        if (isNaN(balance) || isNaN(riskPercent) || isNaN(stopLoss) || isNaN(entry)) {
            toast.error("Mohon masukkan nilai yang valid");
            setIsCalculating(false);
            return;
        }

        if (stopLoss >= entry) {
            toast.error("Harga stop loss harus lebih rendah dari harga masuk");
            setIsCalculating(false);
            return;
        }

        if (balance <= 0 || riskPercent <= 0 || entry <= 0) {
            toast.error("Nilai harus lebih besar dari nol");
            setIsCalculating(false);
            return;
        }

        setTimeout(() => {
            const riskAmount = balance * riskPercent/100;
            const stopLossDistance = entry - stopLoss;
            const positionSizeAsset = riskAmount / stopLossDistance;
            const positionSizeRupiah = positionSizeAsset * entry;

        setResult({
            riskAmount,
            positionSizeAsset,
            positionSizeRupiah,
            assetSymbol: selectCryptoOptions?.symbol.toUpperCase() || '' 
        });
        setIsCalculating(false);
    },500);
    };

    const handleReset = () => {
        setAccountBalance("1000000");
        setRiskPercentage("1");
        setStopLossPrice("0");
        setEntryPrice("0");
        setSelectedCrypto("bitcoin");
        setResult(null);
        if( selectCryptoOptions) {
            setEntryPrice(selectCryptoOptions.current_price.toString());
        }
    }

return (
<div className="min-h-screen bg-background">
    <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">
                    Kalkulator Ukuran Posisi
                </h1>
                <p className="text-lg text-muted-foreground">
                    Hal terpenting dalam trading adalah manajemen risiko. Penentuan ukuran posisi yang tepat dapat menjadi kunci dalam mengurangi kerugian. 
                    Dengan kalkulator ini Anda dapat menghitung ukuran posisi trading dengan mudah berdasarkan saldo akun, persentase risiko, dan harga masuk.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground mb-4">
                        Paramater Trading Kripto
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-6">
                        Masukan detail modal dan rencana trading Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="asset-select">Pilih Aset</Label>
                            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                                <SelectTrigger id="asset-select">
                                    <SelectValue placeholder="Pilih aset..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {isLoading ? <SelectItem value="loading" disabled>Memuat...</SelectItem> :
                                        cryptoData?.map(coin => (
                                            <SelectItem key={coin.id} value={coin.id}>
                                                <div className="flex items-center gap-2">
                                                    <img src={coin.image} alt={coin.name} className="w-5 h-5" />
                                                    <span>{coin.name}</span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div></div>
                        <div className="space-y-2">
                            <Label htmlFor="accountBalance">Total Modal</Label>
                            <Input
                                id="accountBalance"
                                type="number"
                                value={accountBalance}
                                onChange={(e) => setAccountBalance(e.target.value)}
                                placeholder="Masukkan saldo akun"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="riskPercentage">Persentase Risiko (%)</Label>
                            <Input
                                id="riskPercentage"
                                type="number"
                                value={riskPercentage}
                                onChange={(e) => setRiskPercentage(e.target.value)}
                                placeholder="Masukkan persentase risiko"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entryPrice">Harga Masuk</Label>
                            <Input
                                id="entryPrice"
                                type="number"
                                value={entryPrice}
                                onChange={(e) => setEntryPrice(e.target.value)}
                                placeholder="Masukkan harga masuk"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stopLossPrice">Harga Stop Loss</Label>
                            <Input
                                id="stopLossPrice"
                                type="number"
                                value={stopLossPrice}
                                onChange={(e) => setStopLossPrice(e.target.value)}
                                placeholder="Masukkan harga stop loss"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0">
                        <Button 
                            onClick={handleCalculate} 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-glow w-full md:w-auto"
                            disabled={isCalculating}
                        >
                            {isCalculating ? <><Loader2 className="w-5 h-5 animate-spin" /> Menghitung...</> : "Hitung Ukuran Posisi"}
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-primary/30 text-foreground hover:bg-accent w-full md:w-auto"
                            onClick={handleReset}
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Reset
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {result && (
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-foreground mb-4">
                            Hasil Perhitungan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Jumlah Maks Risiko</span>
                                <span className="text-lg font-bold text-foreground">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(result.riskAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Ukuran Posisi (Aset)</span>
                                <span className="text-lg font-bold text-foreground">{result.positionSizeAsset.toFixed(8)} {result.assetSymbol}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Ukuran Posisi (Rupiah)</span>
                                <span className="text-lg font-bold text-foreground">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(result.positionSizeRupiah)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </main>
    <Footer />
</div>
)


}

export default positionSize;
