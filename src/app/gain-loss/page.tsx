"use client";

import { useState, useEffect, useMemo} from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpDown, Loader2, TrendingUp, TrendingDown, RefreshCw, ThumbsUp, ThumbsDown, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query"; 
import { isError } from "postcss/lib/css-syntax-error";

interface CryptoData {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    image: string;
}

interface GainLossData {
    potentialGain: number;
    potentialLoss: number;
    potentialGainPercent: number;
    potentialLossPercent: number;
    riskrewardRatio: number;
}

const fetchCryptoData = async () => {
    const {data} = await axios.get<CryptoData[]>("https://api.coingecko.com/api/v3/coins/markets", {
        params: {
            vs_currency: "idr",
            order: "market_cap_desc",
            per_page: 50,
            page: 1,
            sparkline: false,
        },
    });
    return data;
};

const GainLossCalculator = () => {
    const [entryPrice, setEntryPrice] = useState<string>("");
    const [targetPrice, setTargetPrice] = useState<string>("");
    const [stopLossPrice, setStopLossPrice] = useState<string>("");
    const [selectedCrypto, setSelectedCrypto] = useState<string>("");

    const [leverage, setLeverage] = useState<string>("1");
    const [positionType, setPositionType] = useState<"long" | "short">("long");

    const [result, setResult] = useState<GainLossData | null>(null);
    const [isLoading, setisLoading] = useState<boolean>(false);

    const { data: cryptoData, isLoading: isCryptoLoading } = useQuery({
        queryKey: ["cryptoData"],
        queryFn: fetchCryptoData,
        staleTime: 1000 * 60 * 15, // 5 minutes
    });

    useEffect(() => {
        if(isError(cryptoData)) {
            toast.error("Failed to fetch crypto data");
        }
    }, [cryptoData]);

    const selectedCryptoData = useMemo(() => {
        return cryptoData?.find(crypto => crypto.id === selectedCrypto);
    }, [cryptoData, selectedCrypto]);

    useEffect(() => {
        if (selectedCryptoData) {
            setEntryPrice(selectedCryptoData.current_price.toString());
            setResult(null);
        }
    }, [selectedCryptoData]);
    
    const handleCalculate = () => {
        setisLoading(true);
        setResult(null);

        const entry = parseFloat(entryPrice);
        const target = parseFloat(targetPrice);
        const stopLoss = parseFloat(stopLossPrice);
        const leverageValue = parseInt(leverage,10);
    
        if (isNaN(entry) || isNaN(target) || isNaN(stopLoss) || isNaN(leverageValue)) {
            toast.error("Pastikan semua kolom harga terisi.");
            setisLoading(false);
            return;
        }

        if (positionType === 'long' && (stopLoss >= entry || target <= entry)) {
                toast.error("Logika harga Long salah", { description: "Take Profit > Harga Masuk > Stop Loss." });
                setisLoading(false);
                return;
            }
        if (positionType === 'short' && (stopLoss <= entry || target >= entry)) {
                toast.error("Logika harga Short salah", { description: "Take Profit < Harga Masuk < Stop Loss." });
                setisLoading(false);
                return;
            }
        if( leverageValue < 1 || leverageValue > 100) {
            toast.error("Leverage tidak boleh lebih dari 100x atau kurang dari 1x.");    
            setisLoading(false);
            return;
            }

        setTimeout(() => {
            let potentialGain, potentialLoss;
        if (positionType === 'long') {
            potentialGain = (target - entry) * leverageValue;
            potentialLoss = (entry - stopLoss) * leverageValue;
        } else {    
            potentialGain = (entry - target) * leverageValue;
            potentialLoss = (stopLoss - entry) * leverageValue;
        }

        const potentialGainPercent = (potentialGain / entry) * 100 ;
        const potentialLossPercent = (potentialLoss / entry) * 100 ;
        const riskrewardRatio = potentialGain / potentialLoss;

        setResult({
            potentialGain,
            potentialLoss,
            potentialGainPercent,
            potentialLossPercent,
            riskrewardRatio,
        });
        setisLoading(false);
        }, 500);
    };   

    const handleReset = () => {
        if (selectedCryptoData) {
            setEntryPrice(selectedCryptoData.current_price.toString());
        }
        setTargetPrice("");
        setStopLossPrice("");
        setResult(null);
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "idr",
        }).format(value);
    }

    return (
         <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="pt-20 pb-16 flex-grow">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-foreground mb-4">Kalkulator Untung/Rugi</h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Rencanakan trading Anda secara proaktif dengan menghitung potensi keuntungan atau kerugian sebelum membuka posisi.
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="w-6 h-6 text-primary"/>
                                Rencana Trading
                            </CardTitle>
                            <CardDescription>
                                Masukkan harga masuk, target profit, dan stop loss Anda.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="position-type">Jenis Posisi</Label>
                                      <RadioGroup defaultValue="long" value={positionType} onValueChange={(val) => setPositionType(val as "long" | "short")}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="long" id="long" />
                                            <Label htmlFor="long">Long (Beli)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="short" id="short" />
                                            <Label htmlFor="short">Short (Jual)</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                               
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="asset-select">Pilih Aset</Label>
                                    <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                                        <SelectTrigger id="asset-select">
                                            <SelectValue placeholder="Pilih aset..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {isCryptoLoading ? <SelectItem value="loading" disabled>Memuat...</SelectItem> :
                                                cryptoData?.map(crypto => (
                                                    <SelectItem key={crypto.id} value={crypto.id}>
                                                        <div className="flex items-center gap-2">
                                                            <img src={crypto.image} alt={crypto.name} className="w-5 h-5" />
                                                            <span>{crypto.name} ({crypto.symbol.toUpperCase()})</span>
                                                        </div>
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="entry-price">Harga Masuk (IDR)</Label>
                                    <Input id="entry-price" type="number" placeholder="Harga beli aset" value={entryPrice} onChange={e => setEntryPrice(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="take-profit-price">Target Profit (IDR)</Label>
                                    <Input id="take-profit-price" type="number" placeholder="Harga jual jika untung" value={targetPrice} onChange={e => setTargetPrice(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stop-loss">Harga Stop Loss (IDR)</Label>
                                    <Input id="stop-loss" type="number" placeholder="Harga jual jika rugi" value={stopLossPrice} onChange={e => setStopLossPrice(e.target.value)} />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="leverage">Leverage (1-100x)</Label>
                                    <Input id="leverage" type="number" placeholder="1" value={leverage} onChange={e => setLeverage(e.target.value)} />
                                    <p className="text-sm text-muted-foreground">Leverage digunakan untuk menghitung potensi keuntungan/kerugian.</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button onClick={handleCalculate} disabled={isLoading} className="w-full sm:w-auto">
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menghitung...</> : "Hitung Risk/Reward"}
                                </Button>
                                <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
                                    <RefreshCw className="mr-2 h-4 w-4"/>
                                    Reset
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {result && (
                        <Card className="mt-8 animate-fade-in">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <span className="w-6 h-6" />
                                    Hasil Analisis
                                </CardTitle>
                                <CardDescription>
                                    Berikut adalah potensi hasil dari rencana trading Anda.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-green-500/10 rounded-lg">
                                        <p className="text-sm text-green-700 font-medium">Potensi Keuntungan</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(result.potentialGain)}</p>
                                        <span className="text-2xl font-bold text-green-600">+{result.potentialGainPercent.toFixed(2)}%</span>
                                    </div>
                                    <div className="p-4 bg-red-500/10 rounded-lg">
                                        <p className="text-sm text-red-700 font-medium">Potensi Kerugian</p>
                                        <p className="text-2xl font-bold text-red-600">{formatCurrency(result.potentialLoss)}</p>
                                        <span className="text-2xl font-bold text-red-600">-{result.potentialLossPercent.toFixed(2)}%</span>
                                    </div>
                                    <div className="p-4 bg-blue-500/10 rounded-lg">
                                        <p className="text-sm text-blue-700 font-medium">Risk/Reward Ratio</p>
                                        <p className="text-2xl font-bold text-blue-600">1 : {result.riskrewardRatio.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className={`mt-4 flex items-center justify-center p-4 rounded-lg ${result.riskrewardRatio >= 2 ? 'bg-green-500/10 text-green-700' : 'bg-red-500/10 text-red-700'}`}>
                                    {result.riskrewardRatio >= 2 ? <ThumbsUp className="w-5 h-5 mr-2" /> : <ThumbsDown className="w-5 h-5 mr-2" />}
                                    <p className="font-semibold">
                                        {result.riskrewardRatio >= 2 ? 'Rasio Risk/Reward Sehat (Umumnya di atas 1:2)' : 'Rasio Risk/Reward Kurang Sehat'}
                                    </p>
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
export default GainLossCalculator;