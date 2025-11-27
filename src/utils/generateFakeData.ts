import { faker } from '@faker-js/faker';
import { addDays, format, subDays } from 'date-fns';

const VARIATIONS = ['Control', 'Variant A', 'Variant B'] as const;

export function generateFakeData(days = 90) {
  const endDate = new Date();
  const startDate = subDays(endDate, days - 1);

  return VARIATIONS.map(variation => {
    const baseVisits = variation === 'Control' ? 1400 : variation === 'Variant A' ? 1500 : 1600;
    const uplift = variation === 'Variant A' ? 1.12 : variation === 'Variant B' ? 1.18 : 1.0;

    const data = [];
    let currentDate = startDate;

    for (let i = 0; i < days; i++) {
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const dailyVisits = faker.number.int({
        min: Math.floor(baseVisits * (isWeekend ? 0.6 : 0.9)),
        max: Math.floor(baseVisits * (isWeekend ? 1.1 : 1.3)),
      });

      const baseCR = variation === 'Control' ? 0.072 : variation === 'Variant A' ? 0.081 : 0.085;
      const variance = faker.datatype.boolean(0.7) ? 1 : faker.helpers.arrayElement([-1, 1]);
      const cr = baseCR * uplift * (1 + variance * faker.number.float({ min: 0, max: 0.15 }));

      const conversions = Math.round(dailyVisits * cr);

      data.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        visits: dailyVisits,
        conversions,
      });

      currentDate = addDays(currentDate, 1);
    }

    return { variation, data };
  });
}
