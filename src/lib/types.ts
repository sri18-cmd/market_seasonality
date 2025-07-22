export interface DayData {
  date: Date;
  volatility: number;
  liquidity: number;
  performance: number;
  price: {
    open: number;
    high: number;
    low: number;
    close: number;
  };
}

export type ViewMode = "day" | "week" | "month";
