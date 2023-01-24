import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';

import { HabitDay } from './HabitDay';

import { ModalContext } from '../context/ModalContext';

import { api } from '../lib/axios';

import { generateDatesFromYearBeginning } from '../utils/generateDatesFromYearBeginning';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const { pastDates, futureDates } = generateDatesFromYearBeginning(18);

interface ISummaryResponse {
  id: string;
  date: string;
  possibleHabits: number;
  completedHabits: number;
}

export function SummaryTable() {
  const { isModalOpen } = useContext(ModalContext);
  const [summary, setSummary] = useState<ISummaryResponse[]>([]);
  useEffect(() => {
    api.get('/summary').then((response) => setSummary(response.data));
  }, [isModalOpen]);

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
        {pastDates.map((date, index) => {
          const dayInSummary = summary.find((dayWithHabit) => dayjs(date).isSame(dayWithHabit.date, 'day'));
          return <HabitDay key={index} date={date} habits={{ completed: dayInSummary?.completedHabits, possible: dayInSummary?.possibleHabits }}/>;
        })}
        {futureDates.map((__, index) => <HabitDay key={index} disabled/>)}
      </div>
    </div>
  );
}
