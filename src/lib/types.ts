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
  history: {
    month: string;
    volatility: number;
    liquidity: number;
  }[];
  unavailable?: boolean;
}

export type ViewMode = "day" | "week" | "month";
