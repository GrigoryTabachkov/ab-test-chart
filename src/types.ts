export interface DailyData {
  date: string;
  visits: number;
  conversions: number;
}

export interface Variation {
  variation: string;
  data: DailyData[];
}

export type Timeframe = 'day' | 'week';

export type ChartMode = 'line' | 'smooth' | 'area';

export interface ChartPoint {
  x: string;
  [key: string]: number | string;
}

export type RawData = {
  variations: Array<{ id?: number; name: string }>;
  data: Array<{
    date: string;
    visits: Record<string, number>;
    conversions: Record<string, number>;
  }>;
};
