import { Dimensions, TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface IHabitDayProps extends TouchableOpacityProps{
  disabled?: boolean;
}

const screenPaddingX = (32 * 2) / 5;

export const dayMarginBetween = 8;
export const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export const daySize = (Dimensions.get('screen').width / weekDays.length) - (screenPaddingX + 5);

export function HabitDay({ disabled = false, ...props }: IHabitDayProps) {
  return (
    <TouchableOpacity
      className={`bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 ${disabled ? 'opacity-40' : ''}`}
      style={{ width: daySize, height: daySize }}
      activeOpacity={0.7}
      disabled={disabled}
      {...props}
    />
  );
}
