import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { useChallenges } from '@/hooks/useChallenges';
import type { Challenge, EstadoChallenge } from '@/shared/types';

const ACTIVE: EstadoChallenge[] = ['pendiente', 'aceptado'];
const IN_PROGRESS: EstadoChallenge[] = ['en_curso'];
const HISTORY: EstadoChallenge[] = ['completado', 'rechazado', 'cancelado'];

function filterBy(list: Challenge[], estados: EstadoChallenge[]) {
  return list.filter((c) => estados.includes(c.estado as EstadoChallenge));
}

export default function ChallengesPage() {
  const query = useChallenges();

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Mis retos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestioná tus retos pendientes, en curso y completados.
        </p>
      </header>

      {query.isLoading && <Skeleton className="h-72" />}

      {query.isSuccess && (
        <Tabs defaultValue="activos">
          <TabsList>
            <TabsTrigger value="activos">
              Activos ({filterBy(query.data, ACTIVE).length})
            </TabsTrigger>
            <TabsTrigger value="en_curso">
              En curso ({filterBy(query.data, IN_PROGRESS).length})
            </TabsTrigger>
            <TabsTrigger value="historial">
              Historial ({filterBy(query.data, HISTORY).length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="activos" className="mt-4">
            <ChallengeList list={filterBy(query.data, ACTIVE)} />
          </TabsContent>
          <TabsContent value="en_curso" className="mt-4">
            <ChallengeList list={filterBy(query.data, IN_PROGRESS)} />
          </TabsContent>
          <TabsContent value="historial" className="mt-4">
            <ChallengeList list={filterBy(query.data, HISTORY)} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function ChallengeList({ list }: { list: Challenge[] }) {
  if (list.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12">
        No hay retos en esta categoría.
      </p>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {list.map((c) => (
        <ChallengeCard key={c.id} challenge={c} />
      ))}
    </div>
  );
}
