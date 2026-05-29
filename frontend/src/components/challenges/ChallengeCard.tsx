import { Calendar, MapPin } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChallengeActions } from './ChallengeActions';
import { useAuthStore } from '@/stores/auth.store';
import type { Challenge, EstadoChallenge } from '@/shared/types';

const stateBadgeClass: Record<EstadoChallenge, string> = {
  pendiente: 'bg-yellow-500 hover:bg-yellow-500',
  aceptado: 'bg-blue-500 hover:bg-blue-500',
  en_curso: 'bg-purple-500 hover:bg-purple-500',
  completado: 'bg-green-600 hover:bg-green-600',
  rechazado: 'bg-zinc-500 hover:bg-zinc-500',
  cancelado: 'bg-zinc-500 hover:bg-zinc-500',
};

const stateLabel: Record<EstadoChallenge, string> = {
  pendiente: 'Pendiente',
  aceptado: 'Aceptado',
  en_curso: 'En curso',
  completado: 'Completado',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
};

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const me = useAuthStore((s) => s.user);
  const isRetador = challenge.retador_id === me?.id;
  const role = isRetador ? 'Retaste' : 'Te retaron';
  const estado = (challenge.estado ?? 'pendiente') as EstadoChallenge;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">{role}</p>
          <p className="font-semibold capitalize">
            {challenge.tipo_carrera?.replace('_', ' ')}
          </p>
        </div>
        <Badge className={stateBadgeClass[estado]}>{stateLabel[estado]}</Badge>
      </CardHeader>
      <CardContent className="space-y-1 text-sm text-muted-foreground">
        {challenge.ubicacion_acordada && (
          <p className="flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {challenge.ubicacion_acordada}
          </p>
        )}
        {challenge.fecha_acordada && (
          <p className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(challenge.fecha_acordada).toLocaleString()}
          </p>
        )}
        {challenge.notas && (
          <p className="line-clamp-2 pt-1 text-foreground">
            "{challenge.notas}"
          </p>
        )}
      </CardContent>
      <CardFooter>
        <ChallengeActions challenge={challenge} />
      </CardFooter>
    </Card>
  );
}
