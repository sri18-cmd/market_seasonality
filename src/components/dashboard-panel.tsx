"use client";

import type { DayData, ViewMode } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Waves,
  TrendingUp,
  TrendingDown,
  LineChart,
  DollarSign,
  Calendar as CalendarIcon,
  AreaChart,
  Download,
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function formatPercent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function DashboardPanel({
  selectedData,
  viewMode,
}: {
  selectedData: DayData | null;
  viewMode: ViewMode;
}) {

  const handleDownload = () => {
    if (!selectedData) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(selectedData, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `market_data_${selectedData.date.toISOString().split('T')[0]}.json`;
    link.click();
  };


  if (!selectedData) {
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

  const { date, volatility, liquidity, performance, price, history } = selectedData;
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
        <div>
          <CardTitle className="font-headline flex items-center gap-2">
            <CalendarIcon className="size-6" />
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardTitle>
          <CardDescription>
            Detailed metrics for the selected day
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
              {performance.toFixed(2)}%
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

      </CardContent>
    </Card>
  );
}
