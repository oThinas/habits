import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';

import { ProgressBar } from './ProgressBar';
import { Checkbox } from './Checkbox';

type ConflictProperties<T, K> = K extends true ? { habits?: never, disabled: boolean } :
  { disabled?: never, habits: { possible: number, completed: number } } &
  Omit<T, 'disabled' | 'habits'>;

interface IHabitDayProps {
  disabled?: boolean;
  habits?: { possible: number, completed: number };
}

export function HabitDay({ disabled = false, ...props }: ConflictProperties<IHabitDayProps, IHabitDayProps['disabled']>) {
  const habits = disabled ? { possible: 1, completed: 0 } : (props.habits as { possible: number, completed: number });
  const dayProgress = Math.round((habits.completed / habits.possible) * 100);

  return (
    <Popover.Root>
      <Popover.Trigger
        tabIndex={disabled ? -1 : 0}
        className={
          clsx(
            'w-10 h-10 border-2 border-zinc-800 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-700',
            {
              'opacity-40 cursor-not-allowed': disabled,
              'bg-zinc-900 border-zinc-800': dayProgress === 0,
              'bg-violet-900 border-violet-700': dayProgress > 0 && dayProgress < 25,
              'bg-violet-800 border-violet-600': dayProgress >= 25 && dayProgress < 50,
              'bg-violet-700 border-violet-500': dayProgress >= 50 && dayProgress < 75,
              'bg-violet-600 border-violet-500': dayProgress >= 75 && dayProgress < 100,
              'bg-violet-500 border-violet-400': dayProgress === 100,
            },
          )
        }
      />

      <Popover.Portal>
        <Popover.Content className='min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col'>
          <span className='font-semibold text-zinc-400'>segunda-feira</span>
          <span className='mt-1 font-extrabold leading-tight text-3xl'>20/01</span>

          <ProgressBar progress={dayProgress}/>

          <div className='mt-6 flex flex-col gap-3'>
            <Checkbox variance='habit'>
              Beber 2L de água
            </Checkbox>
          </div>

          <Popover.Arrow className='fill-zinc-900' height={8} width={16}/>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
