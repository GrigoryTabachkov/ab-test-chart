import { format, parseISO, addDays, eachDayOfInterval } from 'date-fns';
import type { RawData } from '../types';

export type ChartPoint = {
  x: string;
} & Record<string, number>;

export const processData = (raw: RawData, timeframe: 'day' | 'week'): ChartPoint[] => {
  const idToName = new Map<string, string>();
  raw.variations.forEach(v => {
    const id = (v.id ?? 0).toString();
    idToName.set(id, v.name);
  });

  if (timeframe === 'day') {
    return raw.data.map(day => {
      const point = { x: format(parseISO(day.date), 'MMM dd') } as ChartPoint;

      raw.variations.forEach(v => {
        const id = (v.id ?? 0).toString();
        const visits = day.visits[id] ?? 0;
        const conversions = day.conversions[id] ?? 0;
        const rate = visits === 0 ? 0 : (conversions / visits) * 100;
        point[v.name] = Number(rate.toFixed(2));
      });

      return point;
    });
  }

  const firstDate = parseISO(raw.data[0].date);
  const lastDate = parseISO(raw.data[raw.data.length - 1].date);

  const weeks = eachDayOfInterval({ start: firstDate, end: lastDate })
    .filter(d => d.getDay() === 1)
    .slice(0, -1);

  return weeks.map(weekStart => {
    const weekEnd = addDays(weekStart, 6);
    const label = `${format(weekStart, 'MMM dd')}-${format(weekEnd, 'dd')}`;
    const point = { x: label } as ChartPoint;

    raw.variations.forEach(v => {
      const id = (v.id ?? 0).toString();
      let totalVisits = 0;
      let totalConversions = 0;

      raw.data.forEach(day => {
        const d = parseISO(day.date);
        if (d >= weekStart && d <= weekEnd) {
          totalVisits += day.visits[id] ?? 0;
          totalConversions += day.conversions[id] ?? 0;
        }
      });

      const rate = totalVisits === 0 ? 0 : (totalConversions / totalVisits) * 100;
      point[v.name] = Number(rate.toFixed(2));
    });

    return point;
  });
};
