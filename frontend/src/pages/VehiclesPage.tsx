import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { VehicleFormDialog } from '@/components/vehicles/VehicleFormDialog';
import { useVehicles } from '@/hooks/useVehicles';

export default function VehiclesPage() {
  const query = useVehicles();

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Mis vehículos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hasta 5 vehículos. El activo es el que usás para retar.
          </p>
        </div>
        <VehicleFormDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Agregar
            </Button>
          }
        />
      </header>

      {query.isLoading && (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      )}

      {query.isSuccess && query.data.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            Todavía no agregaste ningún vehículo.
          </p>
          <VehicleFormDialog
            trigger={
              <Button className="mt-4">
                <Plus className="h-4 w-4" /> Agregar el primero
              </Button>
            }
          />
        </div>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {query.data.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      )}
    </div>
  );
}
