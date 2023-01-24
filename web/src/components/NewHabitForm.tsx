import { useState } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import { Check } from 'phosphor-react';
import clsx from 'clsx';

import { Checkbox } from './Checkbox';

const avaliableDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function NewHabitForm() {
  const { register, handleSubmit } = useForm();
  const [titleError, setTitleError] = useState(false);

  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([]);
  const [selectedWeekDaysError, setSelectedWeekDaysError] = useState(false);
  function handleToggleWeekDay(weekDayIndex: number) {
    setSelectedWeekDaysError(false);
    if (selectedWeekDays.includes(weekDayIndex)) setSelectedWeekDays(selectedWeekDays.filter((dayIndex) => dayIndex !== weekDayIndex));
    else setSelectedWeekDays([...selectedWeekDays, weekDayIndex]);
  }

  const handleCreateNewHabit = (data: FieldValues) => {
    const { title } = data;
    if (title.length < 3 || title.length > 30) setTitleError(true);
    if (selectedWeekDays.length === 0) setSelectedWeekDaysError(true);
    if (titleError || selectedWeekDaysError) return;
    setSelectedWeekDays(selectedWeekDays.sort((a, b) => a - b));
    console.log(title, selectedWeekDays);
  };

  return (
    <form onSubmit={handleSubmit(handleCreateNewHabit)} className='w-full flex flex-col mt-6'>
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
        {...register('title', { minLength: 3, maxLength: 30, onChange: () => setTitleError(false) })}
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
          <Checkbox
            variance='weekDay'
            key={index}
            onCheckedChange={() => handleToggleWeekDay(index)}
          >
            {index === 0 || index === 6 ? `${day}` : `${day}-feira`}
          </Checkbox>
        ))}
      </div>

      {selectedWeekDaysError && (
        <span className='text-red-500 font-semibold text-base mt-2'>
          No mínimo, um dia da semana deve ser selecionado.
        </span>
      )}

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
