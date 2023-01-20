export function HabitDay({ disabled = false }: { disabled?: boolean }) {
  return <div
    className={`w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg 
      ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
    `}
  />;
}
