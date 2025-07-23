"use client";

import * as React from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";
import {
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { DayPicker, type DayProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import type { DayData } from "@/lib/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";

function generateMonthData(dateInMonth: Date): Map<string, DayData> {
  const data = new Map<string, DayData>();
  const days = eachDayOfInterval({
    start: startOfMonth(dateInMonth),
    end: endOfMonth(dateInMonth),
  });

  days.forEach((day) => {
    const volatility = Math.random();
    const liquidity = Math.random();
    const performance = (Math.random() - 0.5) * 5;
    const open = 100 + Math.random() * 10;
    const close = open + (performance / 100) * open;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    
    data.set(format(day, "yyyy-MM-dd"), {
      date: day,
      volatility,
      liquidity,
      performance,
      price: { open, high, low, close },
      history: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2023, i, 1).toLocaleString('default', { month: 'short' }),
        volatility: Math.random() * 0.8 + 0.1,
        liquidity: Math.random() * 800 + 200,
      }))
    });
  });

  return data;
}


function CustomDay(props: DayProps & { data: DayData | undefined }) {
  const { data } = props;

  if (!data || props.displayMonth.getMonth() !== data.date.getMonth()) {
    return <div className="h-full w-full p-4 flex items-center justify-center">{props.date.getDate()}</div>;
  }

  const { volatility, liquidity, performance } = data;

  const getVolatilityClass = () => {
    if (volatility > 0.7) return "bg-heatmap-high hover:bg-red-200/50";
    if (volatility > 0.3) return "bg-heatmap-medium hover:bg-orange-200/50";
    return "bg-heatmap-low hover:bg-green-200/50";
  };
  
  const performanceColor = performance >= 0 ? "text-green-600" : "text-red-600";
  const PerformanceIcon = performance >= 0 ? ArrowUp : ArrowDown;

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative h-full w-full transition-colors duration-200",
              getVolatilityClass()
            )}
          >
            <div className="flex h-full flex-col justify-between p-2">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">{props.date.getDate()}</span>
                <PerformanceIcon className={cn("size-4", performanceColor)} />
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                  <div 
                    className="h-full bg-accent"
                    style={{ width: `${liquidity * 100}%`}}
                    aria-label={`Liquidity: ${liquidity.toFixed(2)}`}
                  ></div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-background border-primary">
          <p className="font-bold">
            {data.date.toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            <li className={performanceColor}>Perf: {performance.toFixed(2)}%</li>
            <li>Vol: {(volatility * 100).toFixed(1)}%</li>
            <li>Liq: {(liquidity * 1000).toFixed(0)}M</li>
          </ul>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}


export function SeasonalityCalendar({ 
  onDaySelect,
  instrument
}: { 
  onDaySelect: (data: DayData | null) => void;
  instrument: string;
}) {
  const [month, setMonth] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState<Date | undefined>(new Date());
  const [data, setData] = React.useState<Map<string, DayData>>(new Map());

  React.useEffect(() => {
    setData(generateMonthData(month));
  }, [month, instrument]);
  
  React.useEffect(() => {
    if (selectedDay) {
      const dayData = data.get(format(selectedDay, "yyyy-MM-dd"));
      onDaySelect(dayData || null);
    } else {
      onDaySelect(null);
    }
  }, [selectedDay, data, onDaySelect]);


  return (
    <Card className="p-4 shadow-xl">
       <DayPicker
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        month={month}
        onMonthChange={setMonth}
        showOutsideDays
        fixedWeeks
        ISOWeek
        components={{
          Day: (props) => (
            <CustomDay {...props} data={data.get(format(props.date, "yyyy-MM-dd"))} />
          ),
        }}
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full space-y-4",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-items-center border-b",
          head_cell: "w-full text-muted-foreground rounded-md w-full h-12 flex justify-center items-center font-normal text-[0.8rem]",
          row: "flex w-full mt-2 gap-2",
          cell: "h-24 w-full text-center text-sm p-0 relative rounded-md overflow-hidden border focus-within:relative focus-within:z-20",
          day: "h-full w-full",
          day_selected: "ring-2 ring-primary ring-offset-2",
          day_today: "font-bold text-primary",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          nav: "space-x-1 flex items-center mb-4",
          caption_label: "text-xl font-bold font-headline",
        }}
        />
    </Card>
  );
}
