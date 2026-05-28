import { useState } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/stores/auth.store';
import { useAvailablePilots } from '@/hooks/useAvailablePilots';
import { PilotCard } from '@/components/pilots/PilotCard';
import type { Rango } from '@/shared/types';

const RANGOS: Rango[] = ['S', 'A', 'B', 'C', 'D'];

export default function DashboardPage() {
  const userRango = useAuthStore((s) => s.user?.rango);
  const [rango, setRango] = useState<Rango | undefined>(userRango);
  const [ciudad, setCiudad] = useState('');

  const query = useAvailablePilots({
    rango,
    ciudad: ciudad || undefined,
    limit: 24,
  });

  return (
    <div className="container mx-auto px-6 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold">Pilotos disponibles</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Solo podés retar a pilotos de tu mismo rango y tipo de vehículo.
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Select
          value={rango ?? 'all'}
          onValueChange={(v) =>
            setRango(v === 'all' ? undefined : (v as Rango))
          }
        >
          <SelectTrigger className="md:w-44">
            <SelectValue placeholder="Rango" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los rangos</SelectItem>
            {RANGOS.map((r) => (
              <SelectItem key={r} value={r}>
                Rango {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Filtrar por ciudad..."
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
        </div>
      </div>

      {query.isLoading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      )}

      {query.isError && (
        <p className="text-sm text-destructive">
          No se pudieron cargar los pilotos.
        </p>
      )}

      {query.isSuccess && query.data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-12">
          No hay pilotos disponibles con esos filtros.
        </p>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {query.data.map((pilot) => (
            <PilotCard key={pilot.id} pilot={pilot} />
          ))}
        </div>
      )}
    </div>
  );
}
