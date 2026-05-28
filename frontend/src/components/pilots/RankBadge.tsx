import { cn } from '@/lib/utils';
import type { Rango } from '@/shared/types';

const colors: Record<Rango, string> = {
  S: 'bg-yellow-500 text-yellow-950',
  A: 'bg-red-500 text-red-50',
  B: 'bg-orange-500 text-orange-50',
  C: 'bg-blue-500 text-blue-50',
  D: 'bg-zinc-500 text-zinc-50',
};

export function RankBadge({
  rango,
  className,
}: {
  rango: Rango;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-md text-xs font-bold h-6 w-6 shrink-0',
        colors[rango],
        className
      )}
      title={`Rango ${rango}`}
    >
      {rango}
    </span>
  );
}
