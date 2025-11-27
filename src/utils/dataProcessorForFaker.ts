import { format, parseISO, addDays, eachDayOfInterval } from 'date-fns';
import type { Variation, ChartPoint } from '../types';

export const calculateConversionRate = (visits: number, conversions: number): number => {
  return visits === 0 ? 0 : (conversions / visits) * 100;
};

export const processData = (
  rawData: Variation[],
  timeframe: 'day' | 'week'
): ChartPoint[] => {
  const variations = rawData as Variation[];

  if (timeframe === 'day') {
    const allDates = Array.from(
      new Set(
        variations.flatMap(v => v.data.map(d => d.date))
      )
    ).sort();

    return allDates.map(date => {
      const point: ChartPoint = { x: format(parseISO(date), 'MMM dd') };
      variations.forEach(v => {
        const day = v.data.find(d => d.date === date);
        if (day) {
          point[v.variation] = Number(
            calculateConversionRate(day.visits, day.conversions).toFixed(2)
          );
        } else {
          point[v.variation] = 0;
        }
      });
      return point;
    });
  }

  const firstDate = parseISO(variations[0].data[0].date);
  const lastDate = parseISO(variations[0].data.at(-1)!.date);
  const weeks = eachDayOfInterval({ start: firstDate, end: lastDate })
    .filter(d => d.getDay() === 1) 
    .slice(0, -1); 

  return weeks.map(weekStart => {
    const weekEnd = addDays(weekStart, 6);
    const label = `${format(weekStart, 'MMM dd')}-${format(weekEnd, 'dd')}`;

    const point: ChartPoint = { x: label };

    variations.forEach(v => {
      let totalVisits = 0;
      let totalConversions = 0;

      v.data.forEach(d => {
        const dDate = parseISO(d.date);
        if (dDate >= weekStart && dDate <= weekEnd) {
          totalVisits += d.visits;
          totalConversions += d.conversions;
        }
      });

      point[v.variation] = Number(
        calculateConversionRate(totalVisits, totalConversions).toFixed(2)
      );
    });

    return point;
  });
};
