import { Link } from 'react-router-dom';
import { MapPin, Trophy } from 'lucide-react';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { RankBadge } from './RankBadge';
import { SendChallengeDialog } from '@/components/challenges/SendChallengeDialog';
import { useAuthStore } from '@/stores/auth.store';
import type { User } from '@/shared/types';

export function PilotCard({ pilot }: { pilot: User }) {
  const me = useAuthStore((s) => s.user);
  const initials = pilot.username?.slice(0, 2).toUpperCase() ?? '?';
  const ciudad = pilot.zona_ciudad ?? '—';
  const isSelf = pilot.id === me?.id;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Avatar>
          {pilot.foto_perfil && (
            <AvatarImage src={pilot.foto_perfil} alt={pilot.username} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{pilot.username}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <MapPin className="h-3 w-3 shrink-0" /> {ciudad}
          </p>
        </div>
        {pilot.rango && <RankBadge rango={pilot.rango} />}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex items-center gap-1">
        <Trophy className="h-3 w-3" />
        {pilot.victorias ?? 0}V · {pilot.derrotas ?? 0}D
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link to={`/users/${pilot.id}`}>Ver perfil</Link>
        </Button>
        {!isSelf && (
          <SendChallengeDialog
            pilot={pilot}
            trigger={
              <Button size="sm" className="flex-1">
                Retar
              </Button>
            }
          />
        )}
      </CardFooter>
    </Card>
  );
}
