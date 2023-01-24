import { useState } from 'react';
import { Check } from 'phosphor-react';

import { Checkbox } from './Checkbox';
import clsx from 'clsx';

const avaliableDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];


export function NewHabitForm() {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  function handleTitleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setTitleError(false);
    setTitle((event.target.value).trim());
  }

  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([]);
  function handleToggleWeekDay(weekDayIndex: number) {
    if (selectedWeekDays.includes(weekDayIndex)) setSelectedWeekDays(selectedWeekDays.filter((dayIndex) => dayIndex !== weekDayIndex));
    else setSelectedWeekDays([...selectedWeekDays, weekDayIndex]);
  }

  function handleCreateNewHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (title.length < 3 || title.length > 30) {
      setTitleError(true);

      return;
    }

    setSelectedWeekDays(selectedWeekDays.sort((a, b) => a - b));

    console.log(title, selectedWeekDays);
  }

  return (
    <form onSubmit={(event) => handleCreateNewHabit(event)} className='w-full flex flex-col mt-6'>
      <label htmlFor='title' className='font-semibold leading-tight'>
        Qual seu comprometimento?
      </label>

      <input
        type='text'
        id='title'
        placeholder='ex.: Praticar exercícios, dormir bem, etc...'
        autoFocus
        className={
          clsx(
            'p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus-visible:ring-2 ring-violet-700',
            { 'ring-2 ring-red-500': titleError },
          )
        }
        onChange={(event) => handleTitleInput(event)}
      />

      {titleError && (
        <span className='text-red-500 font-semibold mt-2'>
          O título deve ter entre 3 e 30 caracteres.
        </span>
      )}

      <label className='font-semibold leading-tight mt-4'>
        Qual a recorrência?
      </label>

      <div className='flex flex-col gap-2 mt-3'>
        {avaliableDays.map((day, index) => (
          <Checkbox variance='weekDay' key={index} onCheckedChange={() => handleToggleWeekDay(index)}>
            {index === 0 || index === 6 ? `${day}` : `${day}-feira`}
          </Checkbox>
        ))}
      </div>

      <button
        type='submit'
        className='mt-6 rounded-lg p-4 gap-3 flex items-center justify-center font-semibold bg-green-600 hover:bg-green-500 transition-colors
        focus:outline-none focus-visible:ring-2 ring-green-800'
      >
        <Check size={20} weight='bold'/>
        Confirmar
      </button>
    </form>
  );
}
