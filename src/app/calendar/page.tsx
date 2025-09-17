"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Filter, TrendingUp, AlertTriangle, RefreshCw, Search, BarChart3, Zap, Globe, TrendingDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, parseISO } from "date-fns";


interface EconomicEvent {
    CalendarId: string;
    Date: string;
    Country: string;
    Category: string;
    Event: string;
    Actual: string | null;
    Previous: string;
    Forecast: string;
    Importance: 1 | 2 | 3;
    Currency: string;
}

// --- Konstanta & Data Statis ---
const COUNTRIES = [
    { code: 'united states', name: 'Amerika Serikat', flag: '🇺🇸' },
    { code: 'euro area', name: 'Zona Euro', flag: '🇪🇺' },
    { code: 'china', name: 'China', flag: '🇨🇳' },
    { code: 'japan', name: 'Jepang', flag: '🇯🇵' },
    { code: 'germany', name: 'Jerman', flag: '🇩🇪' },
];

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'all', name: 'Semua Mata Uang' },
];

const IMPORTANCE_LEVELS = [
    { value: "3", label: "Tinggi", color: "bg-red-500" },
    { value: "2", label: "Sedang", color: "bg-yellow-500" },
    { value: "1", label: "Rendah", color: "bg-green-500" },
];

// --- Fungsi Fetch API ---
const fetchEconomicEvents = async (startDate: Date, endDate: Date): Promise<EconomicEvent[]> => {
    const apiKey = process.env.NEXT_PUBLIC_TRADING_ECONOMICS_API_KEY;
    if (!apiKey) {
        toast.error("API Key tidak ditemukan.");
        throw new Error("API Key is missing.");
    }
    const startDateString = format(startDate, 'yyyy-MM-dd');
    const endDateString = format(endDate, 'yyyy-MM-dd');

    const { data } = await axios.get<EconomicEvent[]>(`https://api.tradingeconomics.com/calendar/country/All/${startDateString}/${endDateString}`, {
        params: { c: apiKey }
    });
    return data;
};

// --- Komponen ---
const EconomicCalendarPage = () => {
    // --- State Management ---
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [filters, setFilters] = useState({
        country: "all",
        importance: "all",
        search: "",
        currency: "all",
    });

    // --- Data Fetching dengan React Query ---
    const { data: events = [], isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["economicEvents", format(selectedDate, 'yyyy-MM-dd')],
        queryFn: () => fetchEconomicEvents(selectedDate, selectedDate),
        staleTime: 1000 * 60 * 15, // 15 menit
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isError) {
            toast.error("Gagal memuat data event ekonomi.");
        }
    }, [isError]);

    // --- Memoized Logic untuk Filtering & Derivasi Data ---
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const countryMatch = filters.country === "all" || event.Country.toLowerCase() === filters.country;
            const importanceMatch = filters.importance === "all" || event.Importance.toString() === filters.importance;
            const searchMatch = event.Event.toLowerCase().includes(filters.search.toLowerCase());
            return countryMatch && importanceMatch && searchMatch;
        });
    }, [events, filters]);

    const todayEvents = useMemo(() => events.filter(e => isToday(parseISO(e.Date))), [events]);
    const highImpactTodayCount = useMemo(() => todayEvents.filter(e => e.Importance === 3).length, [todayEvents]);
    const countriesTodayCount = useMemo(() => new Set(todayEvents.map(e => e.Country)).size, [todayEvents]);
    
    // --- Event Handlers ---
    const handleFilterChange = useCallback((filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    }, []);

    const handleRefresh = useCallback(() => {
      refetch();
      toast.success("Data Diperbarui");
    },[refetch]);

    const clearFilters = useCallback(() => {
        setFilters({ country: "all", importance: "all", search: "", currency: "all" });
        setSelectedDate(new Date());
        toast.info("Semua filter telah dihapus.");
    }, []);

    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        if(!isNaN(newDate.getTime())){
          setSelectedDate(newDate);
        } 
    },[]);

    // --- Render Helper ---
    const getImpactIcon = (actual: string | null, forecast: string) => {
        const actualNum = parseFloat(actual || '');
        const forecastNum = parseFloat(forecast);
        if (isNaN(actualNum) || isNaN(forecastNum)) return <Clock className="w-4 h-4 text-slate-400" />;
        if (actualNum > forecastNum) return <TrendingUp className="w-4 h-4 text-green-600" />;
        if (actualNum < forecastNum) return <TrendingDown className="w-4 h-4 text-red-600" />;
        return <Clock className="w-4 h-4 text-slate-400" />;
    };

    const getImportanceColor =  (importance: number) => {
      switch(importance){
        case 3: return "bg-red-500";
        case 2: return "bg-yellow-500";
        case 1: return "bg-green-500";
        default: return "bg-gray-500";
      }
    };

    const formatTime = (dateString: string) => {
      try {
        const date = parseISO(dateString);
        return format(date,'HH:mm');
      } catch {
        return "00:00";
      }
    };


  return (
    <div className="min-h-screen bg-background flex flex-col">
        < Header/>
        <main className="pt-20 pb-16 flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">Kalender Ekonomi</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Kondisi Makro ekonomi global sangat berpengaruh pada pergerakan pasar. Gunakan Kalender Ekonomi untuk memantau berita penting dan data ekonomi secara real time.Selalu siap, tak pernah tertinggal.
                </p>
            </div>
           
            <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Filter className="w-6 h-6 text-blue-600" />
                Filter & Pencarian
              </CardTitle>
              <CardDescription>Sesuaikan tampilan kalender ekonomi sesuai kebutuhan Anda</CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Country Filter */}
                <div className="space-y-2">
                  <Label>Negara</Label>
                  <Select value={filters.country} onValueChange={(value) => handleFilterChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Negara" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center gap-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Currency Filter */}
                <div className="space-y-2">
                  <Label>Mata Uang</Label>
                  <Select value={filters.currency} onValueChange={(value) => handleFilterChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Mata Uang" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Importance Filter */}
                <div className="space-y-2">
                  <Label>Tingkat Pengaruh</Label>
                  <Select value={filters.importance} onValueChange={(value) => handleFilterChange("importance", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Pengaruh" />
                    </SelectTrigger>
                    <SelectContent>
                      {IMPORTANCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${level.color}`} />
                            <span>{level.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Picker */}
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    value={format(selectedDate, "yyyy-MM-dd")}
                    onChange={handleDateChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Cari Event</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Cari berdasarkan nama event..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                  <Button onClick={clearFilters} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

         {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{todayEvents.length}</p>
              <p className="text-sm text-slate-600">Events Hari Ini</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{highImpactTodayCount}</p>
              <p className="text-sm text-slate-600">High Impact</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{countriesTodayCount}</p>
              <p className="text-sm text-slate-600">Negara</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-600">{filteredEvents.length}</p>
              <p className="text-sm text-slate-600">Filtered Events</p>
            </CardContent>
          </Card>
        </div>

         {/* Events Table */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Zap className="w-6 h-6 text-purple-600" />
              Economic Events - {format(selectedDate, 'dd MMMM yyyy')}
            </CardTitle>
            <CardDescription>
              {isLoading ? "Memuat events..." : `Menampilkan ${filteredEvents.length} events`}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mr-3" />
                <span className="text-slate-600">Loading economic events...</span>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Waktu</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Negara</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Event</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Dampak</th>
                      <th className="text-right p-4 font-semibold text-slate-700">Actual</th>
                      <th className="text-right p-4 font-semibold text-slate-700">Forecast</th>
                      <th className="text-right p-4 font-semibold text-slate-700">Previous</th>
                      <th className="text-center p-4 font-semibold text-slate-700">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.map((event) => (
                      <tr key={event.CalendarId} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            <span className="font-mono text-sm">{formatTime(event.Date)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {COUNTRIES.find((c) => c.code === event.Country.toLowerCase())?.flag || "🌍"}
                            </span>
                            <div>
                              <p className="font-medium text-sm">{event.Country}</p>
                              <p className="text-xs text-slate-500">{event.Currency}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-slate-800">{event.Event}</p>
                            <p className="text-xs text-slate-500">{event.Category}</p>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full ${getImportanceColor(event.Importance)}`} />
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <span className={`font-semibold ${event.Actual ? "text-slate-800" : "text-slate-400"}`}>
                            {event.Actual || "-"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-slate-600">{event.Forecast || "-"}</span>
                        </td>
                        <td className="p-4 text-right">
                          <span className="text-slate-500">{event.Previous || "-"}</span>
                        </td>
                        <td className="p-4 text-center">
                          {getImpactIcon(event.Actual, event.Forecast)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-500">Tidak ada event ekonomi yang ditemukan</p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>


          {/* Legend */}
          <Card className="mt-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 mb-4">Legend & Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Impact Levels</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-sm">High Impact - Major market moving events</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <span className="text-sm">Medium Impact - Moderate market influence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <span className="text-sm">Low Impact - Minor market influence</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-slate-700 mb-2">Trend Indicators</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Better than forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Worse than forecast</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span className="text-sm">No data or as expected</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
        < Footer/>
    </div>
  )
}

export default EconomicCalendarPage;