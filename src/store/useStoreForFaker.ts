import { create } from 'zustand';
import data from '../assets/data.json';

type State = {
  theme: 'light' | 'dark';
  timeframe: 'day' | 'week';
  chartMode: 'line' | 'smooth' | 'area';
  selectedVariations: string[];
  zoomKey: number;
  rawData: any[];
  toggleTheme: () => void;
  setTimeframe: (t: 'day' | 'week') => void;
  setChartMode: (m: 'line' | 'smooth' | 'area') => void;
  toggleVariation: (v: string) => void;
  resetZoom: () => void;
};

export const useStore = create<State>((set, _get) => ({
  theme: 'light',
  timeframe: 'day',
  chartMode: 'smooth',
  selectedVariations: ['Control', 'Variant A', 'Variant B'],
  zoomKey: 0,
  rawData: data as unknown as any[],
  toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  setTimeframe: t => set({ timeframe: t }),
  setChartMode: m => set({ chartMode: m }),
  toggleVariation: v => set(s => {
    const newSel = s.selectedVariations.includes(v)
      ? s.selectedVariations.filter(x => x !== v)
      : [...s.selectedVariations, v];
    return newSel.length ? { selectedVariations: newSel } : s;
  }),
  resetZoom: () => set(s => ({ zoomKey: s.zoomKey + 1 })),
}));
