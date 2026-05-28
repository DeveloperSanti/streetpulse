import { Card, CardContent } from '@/components/ui/card';
import { Trophy, X, Flame } from 'lucide-react';

export function PilotStats({
  victorias,
  derrotas,
  consecutivos,
}: {
  victorias: number;
  derrotas: number;
  consecutivos: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard icon={<Trophy className="h-4 w-4" />} label="Victorias" value={victorias} />
      <StatCard icon={<X className="h-4 w-4" />} label="Derrotas" value={derrotas} />
      <StatCard icon={<Flame className="h-4 w-4" />} label="Racha" value={consecutivos} />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          {label}
        </div>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
