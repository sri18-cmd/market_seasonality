
"use client";

import * as React from "react";
import { AreaChart, Bitcoin, CandlestickChart, DollarSign } from "lucide-react";

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
import { generateMonthData } from "@/components/seasonality-calendar";
import { format } from "date-fns";


export default function Home() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("day");
  const [selectedData, setSelectedData] = React.useState<DayData | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(new Date());
  const [instrument, setInstrument] = React.useState("btc");
  const [monthData, setMonthData] = React.useState<Map<string, DayData>>(new Map());

  React.useEffect(() => {
    if (selectedDay) {
        setMonthData(generateMonthData(selectedDay, instrument));
    }
  }, [selectedDay, instrument]);

  React.useEffect(() => {
      if (selectedDay) {
          const dayKey = format(selectedDay, "yyyy-MM-dd");
          const data = monthData.get(dayKey);
          if (data && !data.unavailable) {
              setSelectedData(data);
          } else {
              setSelectedData(null);
          }
      } else {
          setSelectedData(null);
      }
  }, [selectedDay, monthData]);
  
  const handleInstrumentChange = (newInstrument: string) => {
    setInstrument(newInstrument);
  };
  
  const handleSelectedDayChange = (day: Date | undefined) => {
    setSelectedDay(day);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4">
             <CandlestickChart className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">
            Market Seasonality
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore historical volatility, liquidity, and performance with our interactive market calendar.
          </p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <Select value={instrument} onValueChange={handleInstrumentChange}>
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
                  <SelectItem value="eth">
                     <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 417"><path fill="#343434" d="m127.961 0l-2.795 9.5v275.668l2.795 2.79l127.962-75.638z"/><path fill="#8C8C8C" d="M127.962 0L0 212.32l127.962 75.638V0z"/><path fill="#3C3C3B" d="m127.961 300.478l-2.795-2.08l-125.166-73.282l127.961 191.21z"/><path fill="#8C8C8C" d="M127.962 416.51V300.478l127.962-75.638z"/></svg>
                      <span>ETH/USD</span>
                    </div>
                  </SelectItem>
                   <SelectItem value="sol">
                     <div className="flex items-center gap-2">
                       <AreaChart className="size-5 text-purple-400" />
                       <span>SOL/USD</span>
                     </div>
                  </SelectItem>
                  <SelectItem value="tsla">
                     <div className="flex items-center gap-2">
                       <DollarSign className="size-5 text-red-500" />
                       <span>TSLA</span>
                     </div>
                  </SelectItem>
                   <SelectItem value="aapl">
                     <div className="flex items-center gap-2">
                       <DollarSign className="size-5 text-gray-500" />
                       <span>AAPL</span>
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
            
            <SeasonalityCalendar 
              data={monthData}
              instrument={instrument}
              selectedDay={selectedDay}
              onSelectedDayChange={handleSelectedDayChange}
              viewMode={viewMode}
              onMonthChange={(date) => setMonthData(generateMonthData(date, instrument))}
            />
            
          </div>

          <div className="w-full lg:w-[24rem] xl:w-[26rem] shrink-0">
             <DashboardPanel 
                selectedData={selectedData} 
                viewMode={viewMode} 
                instrument={instrument}
                selectedDay={selectedDay}
                onSelectedDayChange={handleSelectedDayChange}
              />
          </div>
        </main>
      </div>
    </div>
  );
}
