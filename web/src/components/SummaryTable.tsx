import { generateDatesFromYearBeginning } from '../utils/generateDatesFromYearBeginning';
import { HabitDay } from './HabitDay';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const { pastDates, futureDates } = generateDatesFromYearBeginning(18);

export function SummaryTable() {
  return (
    <div className='w-full flex'>
      <div className='grid grid-rows-7 grid-flow-row gap-3'>
        {weekDays.map((day, index) => (
          <div key={index} className='text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center'>
            {day}
          </div>
        ))}
      </div>

      <div className='grid grid-rows-7 grid-flow-col gap-3'>
        {pastDates.map((__, index) => <HabitDay key={index} />)}
        {futureDates.map((__, index) => <HabitDay key={index} disabled />)}
      </div>
    </div>
  );
}
