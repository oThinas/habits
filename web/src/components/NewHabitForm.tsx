import { Check } from 'phosphor-react';

export function NewHabitForm() {
  return (
    <form className='w-full flex flex-col mt-6'>
      <label htmlFor='title' className='font-semibold leading-tight'>
        Qual seu comprometimento?
      </label>

      <input
        type='text'
        id='title'
        placeholder='ex.: Praticar exercícios, dormir bem, etc...'
        autoFocus
        className='p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus-visible:ring-2 ring-violet-700'
      />

      <label className='font-semibold leading-tight mt-4'>
        Qual a recorrência?
      </label>

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
