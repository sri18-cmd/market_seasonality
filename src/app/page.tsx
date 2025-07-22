"use client";

import * as React from "react";
import { BarChart3, Bitcoin, CandlestickChart } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardPanel } from "@/components/dashboard-panel";
import { SeasonalityCalendar } from "@/components/seasonality-calendar";
import type { DayData, ViewMode } from "@/lib/types";

export default function Home() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const [selectedData, setSelectedData] = React.useState<DayData | null>(null);
  
  const handleDaySelect = (data: DayData | null) => {
    setSelectedData(data);
  };
  
  // Initialize with today's data on mount
  React.useEffect(() => {
    const today = new Date();
    const volatility = Math.random();
    const liquidity = Math.random();
    const performance = (Math.random() - 0.5) * 5;
    const open = 100 + Math.random() * 10;
    const close = open + (performance / 100) * open;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    const todayData: DayData = {
      date: today,
      volatility,
      liquidity,
      performance,
      price: { open, high, low, close },
    };
    setSelectedData(todayData);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
             <CandlestickChart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Seasonality Insights
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore historical volatility, liquidity, and performance with our interactive market calendar.
          </p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <Select defaultValue="btc">
                <SelectTrigger className="w-full sm:w-[200px] h-11 text-base font-semibold">
                  <SelectValue placeholder="Select instrument" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">
                    <div className="flex items-center gap-2">
                      <Bitcoin className="size-5 text-orange-400"/> 
                      <span>BTC/USD</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="eth" disabled>
                     <div className="flex items-center gap-2">
                      <BarChart3 className="size-5 text-gray-400"/> 
                      <span>ETH/USD</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <SeasonalityCalendar onDaySelect={handleDaySelect} />
            
          </div>

          <div className="w-full lg:w-[24rem] xl:w-[26rem] shrink-0">
             <DashboardPanel selectedData={selectedData} viewMode={viewMode} />
          </div>
        </main>
      </div>
    </div>
  );
}
