import dayjs from 'dayjs';

interface IGenerateDatesFromYearBeginningReturn {
  pastDates: Date[];
  futureDates: Date[];
}

/**
 * Função auxiliar para gera um array de datas.
 * @param minimunWeekAmount Mínimo de semanas que irão ser geradas a partir do início do ano.
 * @returns Array de datas a partir do início do ano até o número de semanas passado no parâmetro ou até a data de atual, caso esta seja maior do que o número de semanas passado no parâmtro.
 * @example De um dia atual maior que o número de semanas passado no parâmetro 09/01 no caso.
 *
 * generateDatesFromYearBeginning(1) => { pastDates: [Date, Date, Date, Date, Date, Date, Date, Date, Date], futureDates: [] }
 *
 * @example De um dia atual menor que o número de semanas passado no parâmetro 09/01 no caso.
 *
 * generateDatesFromYearBeginning(2) => { pastDates: [Date, Date, Date, Date, Date, Date, Date, Date, Date], futureDates: [undefined, undefined, undefined, undefined, undefined] }
 */
export function generateDatesFromYearBeginning(minimunWeekAmount: number): IGenerateDatesFromYearBeginningReturn {
  const minimunDatesSize = minimunWeekAmount * 7;
  const firstDayOfTheYear = dayjs().startOf('year');
  const today = new Date();
  const pastDates: Date[] = [];
  let compare = firstDayOfTheYear;
  while (compare.isBefore(today)) {
    pastDates.push(compare.toDate());
    compare = compare.add(1, 'day');
  }

  if (pastDates.length >= minimunDatesSize) return { pastDates, futureDates: [] };

  return { pastDates, futureDates: [...Array(minimunDatesSize - pastDates.length)] };
}
