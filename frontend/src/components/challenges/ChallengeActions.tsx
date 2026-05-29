import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { RegisterResultDialog } from './RegisterResultDialog';
import {
  useAcceptChallenge,
  useCancelChallenge,
  useConfirmResult,
  useRejectChallenge,
  useStartChallenge,
} from '@/hooks/useChallenges';
import { useAuthStore } from '@/stores/auth.store';
import type { Challenge, EstadoChallenge } from '@/shared/types';

export function ChallengeActions({ challenge }: { challenge: Challenge }) {
  const me = useAuthStore((s) => s.user);
  const isRetador = challenge.retador_id === me?.id;
  const estado = (challenge.estado ?? 'pendiente') as EstadoChallenge;

  const accept = useAcceptChallenge();
  const reject = useRejectChallenge();
  const cancel = useCancelChallenge();
  const start = useStartChallenge();
  const confirm = useConfirmResult();

  const id = challenge.id as string;
  const hasResult = !!challenge.ganador_id;
  const alreadyConfirmed = isRetador
    ? challenge.confirmado_retador
    : challenge.confirmado_retado;

  if (estado === 'pendiente' && !isRetador) {
    return (
      <div className="flex gap-2 w-full">
        <Button
          size="sm"
          className="flex-1"
          onClick={() =>
            accept.mutate(id, {
              onSuccess: () => toast.success('Reto aceptado'),
              onError: () => toast.error('No se pudo aceptar'),
            })
          }
          disabled={accept.isPending}
        >
          Aceptar
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() =>
            reject.mutate(id, {
              onSuccess: () => toast.success('Reto rechazado'),
              onError: () => toast.error('No se pudo rechazar'),
            })
          }
          disabled={reject.isPending}
        >
          Rechazar
        </Button>
      </div>
    );
  }

  if (estado === 'pendiente' && isRetador) {
    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() =>
          cancel.mutate(id, {
            onSuccess: () => toast.success('Reto cancelado'),
            onError: () => toast.error('No se pudo cancelar'),
          })
        }
        disabled={cancel.isPending}
      >
        Cancelar
      </Button>
    );
  }

  if (estado === 'aceptado') {
    return (
      <Button
        size="sm"
        onClick={() =>
          start.mutate(id, {
            onSuccess: () => toast.success('Reto iniciado'),
            onError: () => toast.error('No se pudo iniciar'),
          })
        }
        disabled={start.isPending}
      >
        Iniciar reto
      </Button>
    );
  }

  if (estado === 'en_curso') {
    if (!hasResult) {
      return (
        <RegisterResultDialog
          challenge={challenge}
          retadorLabel={isRetador ? 'Yo (retador)' : 'Retador'}
          retadoLabel={isRetador ? 'Retado' : 'Yo (retado)'}
          trigger={<Button size="sm">Registrar resultado</Button>}
        />
      );
    }
    if (!alreadyConfirmed) {
      return (
        <Button
          size="sm"
          onClick={() =>
            confirm.mutate(id, {
              onSuccess: () => toast.success('Resultado confirmado'),
              onError: () => toast.error('No se pudo confirmar'),
            })
          }
          disabled={confirm.isPending}
        >
          Confirmar resultado
        </Button>
      );
    }
    return (
      <p className="text-xs text-muted-foreground">
        Esperando confirmación del otro piloto.
      </p>
    );
  }

  return null;
}
