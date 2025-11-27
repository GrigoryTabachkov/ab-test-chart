import { create } from 'zustand';
import rawData from '../assets/data.json';
import type { RawData } from '../types';

const variations = (rawData as RawData).variations.map(v => v.name);

type State = {
  theme: 'light' | 'dark';
  timeframe: 'day' | 'week';
  chartMode: 'line' | 'smooth' | 'area';
  selectedVariations: string[];
  zoomKey: number;
  rawData: {};
  toggleTheme: () => void;
  setTimeframe: (t: 'day' | 'week') => void;
  setChartMode: (m: 'line' | 'smooth' | 'area') => void;
  toggleVariation: (v: string) => void;
  resetZoom: () => void;
};

export const useStore = create<State>((set) => ({
  theme: 'light' as const,
  timeframe: 'day' as const,
  chartMode: 'smooth' as const,
  selectedVariations: variations,
  zoomKey: 0,
  rawData: rawData as RawData,

  toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setTimeframe: (t: 'day' | 'week') => set({ timeframe: t }),
  setChartMode: (m: 'line' | 'smooth' | 'area') => set({ chartMode: m }),
  toggleVariation: (v: string) => set(s => {
    const newSel = s.selectedVariations.includes(v)
      ? s.selectedVariations.filter(x => x !== v)
      : [...s.selectedVariations, v];
    return newSel.length > 0 ? { selectedVariations: newSel } : s;
  }),
  resetZoom: () => set(s => ({ zoomKey: s.zoomKey + 1 })),
}));
