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
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function DashboardPanel({
  selectedData,
  viewMode,
}: {
  selectedData: DayData | null;
  viewMode: ViewMode;
}) {
  if (!selectedData) {
    return (
      <Card className="w-full md:w-96">
        <CardHeader>
          <CardTitle>Market Seasonality Explorer</CardTitle>
          <CardDescription>Select a date to view its metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Hover over a date to see a quick summary or click to pin the data
            here. Use the controls to change the instrument or view.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { date, volatility, liquidity, performance, price } = selectedData;
  const performanceColor = performance >= 0 ? "text-green-600" : "text-red-600";
  const PerformanceIcon = performance >= 0 ? TrendingUp : TrendingDown;

  const priceData = [
    { name: "Open", value: price.open },
    { name: "High", value: price.high },
    { name: "Low", value: price.low },
    { name: "Close", value: price.close },
  ];

  return (
    <Card className="w-full md:w-96 shadow-lg border-2">
      <CardHeader>
        <CardTitle className="font-headline">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardTitle>
        <CardDescription>
          Detailed metrics for the selected day
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PerformanceIcon className={`size-6 ${performanceColor}`} />
              <span className="font-semibold">Performance</span>
            </div>
            <span className={`font-bold text-lg ${performanceColor}`}>
              {performance.toFixed(2)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Waves className="size-6 text-blue-500" />
              <span className="font-semibold">Volatility</span>
            </div>
            <span className="font-bold text-lg text-blue-500">
              {(volatility * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="size-6 text-amber-500" />
              <span className="font-semibold">Liquidity</span>
            </div>
            <span className="font-bold text-lg text-amber-500">
              {(liquidity * 1000).toFixed(0)}M
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
      </CardContent>
    </Card>
  );
}
