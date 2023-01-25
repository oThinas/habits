import { useContext, useState } from 'react';
import { Check } from 'phosphor-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import { Checkbox } from './Checkbox';

import { ModalContext } from '../context/ModalContext';

import { api } from '../lib/axios';

const avaliableDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function NewHabitForm() {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  function handleTitleChange(newTitle: string) {
    setTitleError(false);
    setTitle(newTitle);
  }

  const [selectedWeekDays, setSelectedWeekDays] = useState<number[]>([]);
  const [selectedWeekDaysError, setSelectedWeekDaysError] = useState(false);
  function handleToggleWeekDay(weekDayIndex: number) {
    setSelectedWeekDaysError(false);
    if (selectedWeekDays.includes(weekDayIndex)) setSelectedWeekDays(selectedWeekDays.filter((dayIndex) => dayIndex !== weekDayIndex));
    else setSelectedWeekDays([...selectedWeekDays, weekDayIndex]);
  }

  const { toggleModalOpenState } = useContext(ModalContext);
  async function makeResquest(data: { title: string; selectedWeekDays: number[] }) {
    await api.post('/habits', {
      title: data.title,
      weekDays: data.selectedWeekDays,
    }).then(() => toggleModalOpenState());
  }

  function handleCreateNewHabit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const hasTitleError = Boolean(title.length < 3 || title.length > 30);
    const hasSelectedWeekDaysError = Boolean(selectedWeekDays.length === 0);

    if (hasTitleError || hasSelectedWeekDaysError) {
      (hasTitleError) && setTitleError(true);
      (hasSelectedWeekDaysError) && setSelectedWeekDaysError(true);
      // return;
    }

    setSelectedWeekDays(selectedWeekDays.sort((a, b) => a - b));

    toast.promise(makeResquest({ title, selectedWeekDays }), {
      loading: 'Criando hábito...',
      success: 'Hábito criado com sucesso!',
      error: 'Erro do servidor ao criar o hábito.',
    });
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
        value={title}
        onChange={(event) => handleTitleChange((event.target.value).trim())}
        className={
          clsx(
            'p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus-visible:ring-2 ring-violet-700',
            { 'ring-2 ring-red-500': titleError },
          )
        }
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
        focus:outline-none focus-visible:ring-2 ring-green-800 disabled:bg-zinc-500'
        disabled={title.trim().length === 0 || selectedWeekDays.length === 0}
      >
        <Check size={20} weight='bold'/>
        Confirmar
      </button>
    </form>
  );
}
