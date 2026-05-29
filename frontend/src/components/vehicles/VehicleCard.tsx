import { Pencil, Trash2, Power } from 'lucide-react';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { VehicleFormDialog } from './VehicleFormDialog';
import {
  useActivateVehicle,
  useDeleteVehicle,
} from '@/hooks/useVehicleMutations';
import type { Vehicle } from '@/shared/types';

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const activate = useActivateVehicle();
  const remove = useDeleteVehicle();

  const onActivate = () => {
    activate.mutate(vehicle.id as string, {
      onSuccess: () => toast.success('Vehículo activado'),
      onError: () => toast.error('No se pudo activar'),
    });
  };

  const onDelete = () => {
    remove.mutate(vehicle.id as string, {
      onSuccess: () => toast.success('Vehículo eliminado'),
      onError: () => toast.error('No se pudo eliminar'),
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <div>
          <p className="font-semibold">
            {vehicle.marca} {vehicle.modelo}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {vehicle.tipo_vehiculo?.replace('_', ' ')} · {vehicle.anio}
          </p>
        </div>
        {vehicle.activo && (
          <Badge className="bg-green-600 hover:bg-green-600">Activo</Badge>
        )}
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground space-y-1">
        <p>
          <span className="font-medium text-foreground">Placa:</span>{' '}
          {vehicle.placa}
        </p>
        {vehicle.color && (
          <p>
            <span className="font-medium text-foreground">Color:</span>{' '}
            {vehicle.color}
          </p>
        )}
        {vehicle.modificaciones && (
          <p className="line-clamp-2">{vehicle.modificaciones}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {!vehicle.activo && (
          <Button
            size="sm"
            variant="outline"
            onClick={onActivate}
            disabled={activate.isPending}
          >
            <Power className="h-3 w-3" /> Activar
          </Button>
        )}
        <VehicleFormDialog
          vehicle={vehicle}
          trigger={
            <Button size="sm" variant="outline">
              <Pencil className="h-3 w-3" /> Editar
            </Button>
          }
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-destructive">
              <Trash2 className="h-3 w-3" /> Eliminar
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar este vehículo?</AlertDialogTitle>
              <AlertDialogDescription>
                Se eliminará "{vehicle.marca} {vehicle.modelo}" ({vehicle.placa}
                ) y no podrá usarse en retos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-white hover:bg-destructive/90"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
