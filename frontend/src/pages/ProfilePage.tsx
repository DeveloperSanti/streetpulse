import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { RankBadge } from '@/components/pilots/RankBadge';
import { PilotStats } from '@/components/pilots/PilotStats';
import { EditProfileDialog } from '@/components/pilots/EditProfileDialog';
import { useAuthStore } from '@/stores/auth.store';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserChallenges } from '@/hooks/useUserChallenges';
import { useVehicles } from '@/hooks/useVehicles';

export default function ProfilePage({ self = false }: { self?: boolean }) {
  const { id: paramId } = useParams<{ id: string }>();
  const me = useAuthStore((s) => s.user);
  const targetId = self ? me?.id : paramId;
  const isOwn = self || targetId === me?.id;

  const profile = useUserProfile(targetId);
  const challenges = useUserChallenges(targetId);
  const vehicles = useVehicles(isOwn);

  const user = profile.data;

  if (profile.isLoading) {
    return (
      <div className="container mx-auto px-6 py-8 space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-24" />
      </div>
    );
  }

  if (profile.isError || !user) {
    return (
      <div className="container mx-auto px-6 py-16 text-center">
        <p className="text-muted-foreground">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  const initials = user.username?.slice(0, 2).toUpperCase() ?? '?';
  const ciudad = [user.zona_ciudad, user.zona_pais].filter(Boolean).join(', ');

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 max-w-4xl">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {user.foto_perfil && (
                <AvatarImage src={user.foto_perfil} alt={user.username} />
              )}
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{user.username}</h1>
                {user.rango && <RankBadge rango={user.rango} />}
              </div>
              {ciudad && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {ciudad || '—'}
                </p>
              )}
            </div>
          </div>
          {isOwn && <EditProfileDialog user={user} />}
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <PilotStats
            victorias={user.victorias ?? 0}
            derrotas={user.derrotas ?? 0}
            consecutivos={user.retos_consecutivos ?? 0}
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges">
        <TabsList>
          <TabsTrigger value="challenges">Retos</TabsTrigger>
          {isOwn && <TabsTrigger value="vehicles">Mis vehículos</TabsTrigger>}
        </TabsList>

        <TabsContent value="challenges" className="mt-4">
          {challenges.isLoading && <Skeleton className="h-24" />}
          {challenges.isSuccess && challenges.data.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aún no participaste en retos.
            </p>
          )}
          {challenges.isSuccess && challenges.data.length > 0 && (
            <div className="space-y-2">
              {challenges.data.map((c) => (
                <Card key={c.id}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {c.tipo_carrera ?? '—'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {c.fecha_acordada
                          ? new Date(c.fecha_acordada).toLocaleDateString()
                          : 'Sin fecha'}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      {c.estado}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isOwn && (
          <TabsContent value="vehicles" className="mt-4">
            {vehicles.isLoading && <Skeleton className="h-24" />}
            {vehicles.isSuccess && vehicles.data.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Todavía no tenés vehículos registrados.
              </p>
            )}
            {vehicles.isSuccess && vehicles.data.length > 0 && (
              <div className="space-y-2">
                {vehicles.data.map((v) => (
                  <Card key={v.id}>
                    <CardContent className="py-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {v.marca} {v.modelo} ({v.anio})
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {v.tipo_vehiculo?.replace('_', ' ')} · {v.placa}
                        </p>
                      </div>
                      {v.activo && (
                        <span className="text-xs font-medium text-green-600">
                          Activo
                        </span>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
