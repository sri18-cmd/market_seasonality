
"use client";

import type { DayData, ViewMode } from "@/lib/types";
import {
  Waves,
  TrendingUp,
  TrendingDown,
  LineChart,
  DollarSign,
  Calendar as CalendarIcon,
  AreaChart,
  Download,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Area,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
} from "recharts";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateMonthData } from "./seasonality-calendar";
import React from "react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from "date-fns";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function aggregateData(data: DayData[]): Omit<DayData, 'date' | 'history'> | null {
  if (data.length === 0) return null;

  const totalVolatility = data.reduce((acc, d) => acc + d.volatility, 0);
  const totalLiquidity = data.reduce((acc, d) => acc + d.liquidity, 0);
  const firstDay = data[0];
  const lastDay = data[data.length - 1];

  const open = firstDay.price.open;
  const close = lastDay.price.close;
  const high = Math.max(...data.map(d => d.price.high));
  const low = Math.min(...data.map(d => d.price.low));

  const performance = open === 0 ? 0 : ((close - open) / open);

  return {
    volatility: totalVolatility / data.length,
    liquidity: totalLiquidity, // Sum for the period
    performance,
    price: { open, high, low, close },
  };
}


export function DashboardPanel({
  selectedData,
  viewMode,
  instrument,
  selectedDay,
  onSelectedDayChange,
}: {
  selectedData: DayData | null;
  viewMode: ViewMode;
  instrument: string;
  selectedDay: Date | undefined;
  onSelectedDayChange: (day: Date | undefined) => void;
}) {
  const [periodData, setPeriodData] = React.useState<Omit<DayData, 'date' | 'history'> | null>(null);
  const [title, setTitle] = React.useState<string>("Market Insights");

  React.useEffect(() => {
    if (!selectedDay || !instrument) {
      setPeriodData(null);
      return;
    }
    
    const monthData = generateMonthData(selectedDay, instrument);
    let dataForPeriod: DayData[] = [];
    
    if (viewMode === 'day' && selectedData) {
      dataForPeriod = [selectedData];
      setTitle(selectedDay.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));
    } else if (viewMode === 'week') {
      const weekStart = startOfWeek(selectedDay, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDay, { weekStartsOn: 1 });
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
      daysInWeek.forEach(day => {
        const dayKey = format(day, "yyyy-MM-dd");
        // We might need to generate data for previous/next months if the week spans them
        const dataForDay = monthData.get(dayKey) ?? generateMonthData(day, instrument).get(dayKey);
        if(dataForDay) dataForPeriod.push(dataForDay);
      });
      setTitle(`Week of ${weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`);
    } else if (viewMode === 'month') {
        const monthStart = startOfMonth(selectedDay);
        const monthEnd = endOfMonth(selectedDay);
        const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
        daysInMonth.forEach(day => {
            const dayKey = format(day, "yyyy-MM-dd");
            const data = monthData.get(dayKey);
            if(data) dataForPeriod.push(data);
        });
        setTitle(selectedDay.toLocaleDateString("en-US", { year: "numeric", month: "long" }));
    }

    if (viewMode === 'day' && selectedData) {
      setPeriodData(selectedData);
    } else if (dataForPeriod.length > 0) {
      setPeriodData(aggregateData(dataForPeriod));
    } else {
      setPeriodData(null);
    }

  }, [selectedData, viewMode, selectedDay, instrument]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedDay) return;
    let newDate;
    if (viewMode === 'day') {
      newDate = direction === 'prev' ? subDays(selectedDay, 1) : addDays(selectedDay, 1);
    } else if (viewMode === 'week') {
      newDate = direction === 'prev' ? subWeeks(selectedDay, 1) : addWeeks(selectedDay, 1);
    } else { // month
      newDate = direction === 'prev' ? subMonths(selectedDay, 1) : addMonths(selectedDay, 1);
    }
    onSelectedDayChange(newDate);
  };


  const handleDownload = () => {
    if (!periodData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(periodData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `market_data_${title.replace(/ /g, '_')}.json`;
    link.click();
  };


  if (!periodData || !selectedDay) {
    return (
      <Card className="w-full lg:w-[24rem] xl:w-[26rem] sticky top-8">
        <CardHeader>
          <CardTitle>Market Insights</CardTitle>
          <CardDescription>Select a date to view its metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Click a date on the calendar to see detailed metrics. Use the controls to change the instrument or view.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { volatility, liquidity, performance, price } = periodData;
  const history = selectedData?.history ?? [];
  const performanceColor = performance >= 0 ? "text-green-600" : "text-red-600";
  const PerformanceIcon = performance >= 0 ? TrendingUp : TrendingDown;

  const priceData = [
    { name: "Open", value: price.open },
    { name: "High", value: price.high },
    { name: "Low", value: price.low },
    { name: "Close", value: price.close },
  ];

  return (
    <Card className="w-full lg:w-[24rem] xl:w-[26rem] shadow-lg border-2 sticky top-8">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="flex-1">
          <CardTitle className="font-headline flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleNavigate('prev')}>
                <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-center text-lg">{title}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleNavigate('next')}>
                <ChevronRight className="h-5 w-5" />
            </Button>
          </CardTitle>
          <CardDescription className="text-center mt-1">
            Detailed metrics for the selected {viewMode}
          </CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={handleDownload} aria-label="Download data">
          <Download className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col p-3 rounded-lg bg-muted/50">
             <div className="flex items-center justify-center gap-2">
                <PerformanceIcon className={`size-5 ${performanceColor}`} />
                <span className="text-sm font-semibold">Performance</span>
             </div>
             <span className={`font-bold text-2xl ${performanceColor}`}>
              {(performance * 100).toFixed(2)}%
            </span>
          </div>
           <div className="flex flex-col p-3 rounded-lg bg-muted/50">
             <div className="flex items-center justify-center gap-2">
                <Waves className="size-5 text-blue-500" />
                <span className="text-sm font-semibold">Volatility</span>
             </div>
             <span className="font-bold text-2xl text-blue-500">
              {(volatility * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-foreground flex items-center gap-2">
            <LineChart className="size-5" /> Price Action
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={priceData} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                contentStyle={{ 
                  background: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))', 
                  borderRadius: 'var(--radius)'
                }}
                formatter={(value: number) => formatPrice(value)}
              />
              <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]}>
                <LabelList dataKey="value" position="top" formatter={(value: number) => formatPrice(value)} fontSize={12} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <Separator />

        {viewMode === 'day' && history.length > 0 && (
          <>
            <div>
              <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                <AreaChart className="size-5" /> Historical Volatility (12m)
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <RechartsLineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis tickFormatter={formatPercent} stroke="#888888" fontSize={12} />
                  <Tooltip 
                    formatter={(value: number) => formatPercent(value)}
                    contentStyle={{ 
                      background: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Line type="monotone" dataKey="volatility" stroke="hsl(var(--primary))" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h3 className="mb-4 font-semibold text-foreground flex items-center gap-2">
                <DollarSign className="size-5" /> Historical Liquidity (12m)
              </h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis tickFormatter={(val) => `${val}M`} stroke="#888888" fontSize={12}/>
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(0)}M`}
                    contentStyle={{ 
                      background: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))', 
                      borderRadius: 'var(--radius)'
                    }}
                  />
                  <Bar dataKey="liquidity" fill="hsl(var(--accent))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

      </CardContent>
    </Card>
  );
}
