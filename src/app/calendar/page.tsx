"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, TrendingUp, AlertCircle } from "lucide-react";
import { isError } from "postcss/lib/css-syntax-error";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { format, isToday, isTomorrow, parseISO } from "date-fns";


interface economicsEvents {
  CalendarId: string;
  Date: string;
  Country: string;
  Category: string;
  Event: string;
  Reference: string;
  Source: string;
  SourceURL: string;
  Actual: string | null;
  Previous: string;
  Forecast: string;
  TEForecast: string;
  URL: string;
  Importance: number;
  LastUpdate: string;
  Revised: string;
  Currency: string;
}

const fetchEconomicsEvent = async () => {
    const api_key = process.env.NEXT_PUBLIC_TRADING_ECONOMICS_API_KEY;
    const {data} = await axios.get<economicsEvents[]>("https://api.tradingeconomics.com/calendar", {
        params: {
            c: api_key
        }
    });
    return data;
};

const economicsCalendar = () => {
    const [events, setEvents] = useState<economicsEvents[]>([]);
    const [Loading, setLoading] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedCountry, setSelectedCountry] = useState<string>("all");
    const [selectedImportance, setSelectedImportance] = useState<string>("all");

    const { data: economicsEvents, isLoading: isEventLoading} = useQuery ({
        queryKey: ["economicsEvents"],
        queryFn: fetchEconomicsEvent,
        staleTime: 1000 * 60 * 5
    });

    useEffect(() => {
        if(isError(economicsEvents)) {
            toast.error("Gagal Memuat Data Event");
        }
    }, [economicsEvents]);

    const getImportanceColor = (importance: number) => {
    switch (importance) {
      case 1:
        return "bg-muted text-muted-foreground";
      case 2:
        return "bg-secondary text-secondary-foreground";
      case 3:
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getImportanceText = (importance: number) => {
    switch (importance) {
      case 1:
        return "Low";
      case 2:
        return "Medium";
      case 3:
        return "High";
      default:
        return "Unknown";
    }
  };

    const filteredEvents = events.filter(event => {
    const eventDate = parseISO(event.Date);
    const dateMatch = format(eventDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    const countryMatch = selectedCountry === "all" || event.Country === selectedCountry;
    const importanceMatch = selectedImportance === "all" || event.Importance.toString() === selectedImportance;
    
    return dateMatch && countryMatch && importanceMatch;
  });

  const todayEvents = events.filter(event =>isToday(parseISO(event.Date)));
  const tomorrowEvents = events.filter(event =>isTomorrow(parseISO(event.Date)));

  const countries = Array.from(new Set(events.map(event => event.Country)));

  const getLabel = (date: Date) => {
    if(isToday(date)) return "Today";
    if(isTomorrow(date)) return "Tomorrow";
    return format(date, "MM dd, yyyy");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
        < Header/>
        <main className="pt-20 pb-16 flex-grow">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-foreground mb-4">Kalender Ekonomi</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Kondisi Makro ekonomi global sangat berpengaruh pada pergerakan pasar. Gunakan Kalender Ekonomi untuk memantau berita penting dan data ekonomi secara real time.Selalu siap, tak pernah tertinggal.
                </p>
            </div>
            <Card>

            </Card>

        </main>
        < Footer/>
    </div>
  )


}

export default economicsCalendar;