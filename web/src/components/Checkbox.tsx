import * as CheckboxRadix from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import { Check } from 'phosphor-react';

interface ICheckboxProps {
  children: (string | JSX.Element)[] | string | JSX.Element;
  type: 'habit' | 'weekDay';
}

export function Checkbox(props: ICheckboxProps) {
  return (
    <CheckboxRadix.Root className='flex items-center gap-3 group'>
      <div
        className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800
        group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'
      >
        <CheckboxRadix.Indicator>
          <Check size={20} className='text-white'/>
        </CheckboxRadix.Indicator>
      </div>

      <span
        className={
          clsx(
            'leading-tight text-white',
            { 'font-semibold text-xl group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400': props.type === 'habit' },
          )
        }
      >
        {props.children}
      </span>
    </CheckboxRadix.Root>
  );
}
