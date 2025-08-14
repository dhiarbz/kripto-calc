"use client";
import { useEffect, useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Loader2, TrendingUp, TrendingDown, RefreshCw, Filter, X } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image"; // 1. TAMBAHKAN: Impor komponen Image

interface MarketData {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    market_cap: number;
    total_volume: number;
    price_change_percentage_24h: number;
    high_24h: number;
    low_24h: number;
    image: string;
}

interface Category {
    category_id: string;
    name: string;
}

const fetchCategories = async () => {
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/categories/list");
    return response.data as Category[];
}

const fetchMarketData = async (category?: string) => {
    const params: any = {
        vs_currency: "idr",
        order: "market_cap_desc",
        per_page: 50,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
    }
        
    if(category && category !== "all") {
        params.category = category;
    }
    const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
        params,     
    })
    return response.data as MarketData[];
}

const Market = () => {
    const [sortBy, setSortBy] = useState<keyof MarketData>("market_cap");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [showFilter, setShowFilter] = useState(false);

    const { data: categories, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000,
    })

    const {
        data: marketData,
        isLoading,
        isError, 
        refetch
    } = useQuery({
        queryKey: ["marketData", selectedCategory],
        queryFn: () => fetchMarketData(selectedCategory),
        refetchInterval: 60000,
        staleTime: 30000,
    });
    
    // Tampilkan notifikasi jika gagal
    useEffect(() => {
        if (isError) {
            toast.error("Gagal memuat data pasar kripto. Silakan coba lagi.");
        }
    }, [isError]);

    const sortedMarketData = useMemo(() => {
        if (!marketData) return [];
        return [...marketData].sort((a, b) => {
            const aValue = a[sortBy];
            const bValue = b[sortBy];
            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
            }
            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }
            return 0;
        });
    }, [marketData, sortBy, sortOrder]);

    const handleSort = (value: keyof MarketData) => {
        if (sortBy === value) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(value);
            setSortOrder("desc");
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    }
    
    const handleRefresh = () => {
        refetch();
        toast.success("Data pasar berhasil diperbarui.");   
    }

    const handleCategoryChange = (value: string) => {
        const categoryName = popularCategories.find(c => c.id === value)?.name || categories?.find(c => c.category_id === value)?.name || "Semua";
        setSelectedCategory(value);
        toast.info(`Filter diubah ke kategori: ${categoryName}`);
    };

    const clearFilter = () => {
        setSelectedCategory("all"); 
        toast.info("Filter kategori dihapus.");
    }

    const popularCategories = [
        { id: "all", name: "Semua" },
        { id: "decentralized-finance-defi", name: "DeFi" },
        { id: "smart-contract-platform", name: "Smart Contract" },
        { id: "layer-1", name: "Layer 1" },
        { id: "meme-token", name: "Meme" },
        { id: "gaming", name: "Gaming" },
        { id: "non-fungible-tokens-nft", name: "NFT" }, // ID NFT yang benar
        { id: "metaverse", name: "Metaverse" },
    ];

    return (
        <section id="market" className="py-16 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* ... Header Section ... */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">Harga Aset Kripto</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Data harga cryptocurrency real-time dalam Rupiah dari CoinGecko
                    </p>
                </div>

                {/* ... Filters Section ... */}
                <div className="mb-8 space-y-4">
                    {/* ... Tombol Filter & Refresh ... */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilter(!showFilter)}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Filter Kategori
                            </Button>
                            {selectedCategory !== "all" && (
                                <Button variant="ghost" size="sm" onClick={clearFilter} className="flex items-center gap-1">
                                <X className="h-3 w-3" />
                                Clear
                                </Button>
                            )}
                            </div>
                            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            Refresh
                            </Button>
                        </div>

                    {/* Popular Categories */}
                    <div className="flex flex-wrap gap-2">
                        {popularCategories.map((category) => (
                            <Badge
                                key={category.id}
                                variant={selectedCategory === category.id ? "default" : "secondary"}
                                className={`cursor-pointer transition-colors ${
                                    selectedCategory === category.id ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted"
                                }`}
                                onClick={() => handleCategoryChange(category.id)}
                            >
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                    {/* ... sisa filter ... */}
                        {showFilter && (
                            <Card className="p-4">
                            <div className="space-y-4">
                                <h3 className="font-semibold">Filter Lanjutan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Pilih Kategori</label>
                                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih kategori..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Kategori</SelectItem>
                                        {categories?.map((category) => (
                                        <SelectItem key={category.category_id} value={category.category_id}>
                                            {category.name}
                                        </SelectItem>
                                        ))}
                                    </SelectContent>
                                    </Select>
                                </div>
                                </div>
                            </div>
                        </Card>
                        )}
                    {/* Active Filter Display */}
                        {selectedCategory !== "all" && (
                            <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Filter aktif:</span>
                            <Badge variant="outline" className="bg-[#C9FD35]/10 border-[#C9FD35]">
                                {categories?.find((c) => c.category_id === selectedCategory)?.name || selectedCategory}
                            </Badge>
                            </div>
                        )}
                </div>

                {/* Market Data Table */}
                <Card className="overflow-hidden">
                    {/* ... CardHeader ... */}
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">#</th>
                                        <th className="text-left p-4 font-semibold">Nama</th>
                                        <th className="text-right p-4 font-semibold">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("current_price")}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Harga
                                            <ArrowUpDown className="ml-1 h-3 w-3" />
                                        </Button>
                                        </th>
                                        <th className="text-right p-4 font-semibold">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("price_change_percentage_24h")}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            24h %
                                            <ArrowUpDown className="ml-1 h-3 w-3" />
                                        </Button>
                                        </th>
                                        <th className="text-right p-4 font-semibold hidden md:table-cell">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("market_cap")}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Market Cap
                                            <ArrowUpDown className="ml-1 h-3 w-3" />
                                        </Button>
                                        </th>
                                        <th className="text-right p-4 font-semibold hidden lg:table-cell">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleSort("total_volume")}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Volume 24h
                                            <ArrowUpDown className="ml-1 h-3 w-3" />
                                        </Button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center p-8">
                                                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                                                <p className="text-muted-foreground">Memuat data...</p>
                                            </td>
                                        </tr>
                                    ) : sortedMarketData.length > 0 ? (
                                        sortedMarketData.map((coin, index) => (
                                            <tr key={coin.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="p-4 text-muted-foreground font-medium">{index + 1}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <Image
                                                            src={coin.image || "/placeholder.svg"}
                                                            alt={coin.name}
                                                            width={32}
                                                            height={32}
                                                            className="rounded-full"
                                                        />
                                                        <div>
                                                            <div className="font-semibold text-foreground">{coin.name}</div>
                                                            <div className="text-sm text-muted-foreground uppercase">{coin.symbol}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right font-semibold">{formatCurrency(coin.current_price)}</td>
                                                <td className="p-4 text-right">
                                                    <div className={`flex items-center justify-end space-x-1 ${
                                                        coin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                        {coin.price_change_percentage_24h >= 0 ? (
                                                            <TrendingUp className="h-3 w-3" />
                                                        ) : (
                                                            <TrendingDown className="h-3 w-3" />
                                                        )}
                                                        <span className="font-semibold">
                                                            {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right font-medium hidden md:table-cell">
                                                    {formatCurrency(coin.market_cap)}
                                                </td>
                                                <td className="p-4 text-right font-medium hidden lg:table-cell">
                                                    {formatCurrency(coin.total_volume)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center p-8">
                                                <p className="text-muted-foreground">
                                                    {selectedCategory === "all"
                                                        ? "Tidak ada data tersedia"
                                                        : "Tidak ada token dalam kategori ini"}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default Market;