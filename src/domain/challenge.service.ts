import { prisma } from '../lib/prisma';
import { emitToUser } from '../lib/socket';
import { SocketEvents } from '../infrastructure/websockets/socket.events';
import { AppError, ErrorCodes } from '../shared/errors';

const RANGO_SIGUIENTE: Record<string, string | null> = {
  D: 'C', C: 'B', B: 'A', A: 'S', S: null,
};

export async function listChallenges(userId: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { OR: [{ retador_id: userId }, { retado_id: userId }] };

  const [data, total] = await Promise.all([
    prisma.challenge.findMany({ skip, take: limit, where, orderBy: { created_at: 'desc' } }),
    prisma.challenge.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getChallenge(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Reto no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (challenge.retador_id !== userId && challenge.retado_id !== userId) {
    throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  }
  return challenge;
}

export async function sendChallenge(retador_id: string, data: any) {
  if (retador_id === data.retado_id) throw new AppError('No puedes retarte a ti mismo', 422, ErrorCodes.SAME_USER);

  const [retador, retado, vehiculo_retador] = await Promise.all([
    prisma.user.findUnique({ where: { id: retador_id } }),
    prisma.user.findUnique({ where: { id: data.retado_id } }),
    prisma.vehicle.findUnique({ where: { id: data.vehiculo_retador_id } }),
  ]);

  if (!retador || !retado) throw new AppError('Usuario no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (!vehiculo_retador) throw new AppError('Vehículo no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (vehiculo_retador.user_id !== retador_id) throw new AppError('El vehículo no te pertenece', 403, ErrorCodes.FORBIDDEN);
  if (!vehiculo_retador.activo) throw new AppError('El vehículo no está activo', 422, ErrorCodes.VEHICLE_NOT_ACTIVE);

  const vehiculos_retado = await prisma.vehicle.findMany({ where: { user_id: data.retado_id } });
  const vehiculo_retado_activo = vehiculos_retado.find((v: { activo: boolean }) => v.activo);
  if (!vehiculo_retado_activo) throw new AppError('El retado no tiene vehículo activo', 422, ErrorCodes.NO_VEHICLE_REGISTERED);

  if (vehiculo_retador.tipo_vehiculo !== vehiculo_retado_activo.tipo_vehiculo) {
    throw new AppError('Los vehículos deben ser del mismo tipo', 422, ErrorCodes.DIFFERENT_VEHICLE_TYPE);
  }
  if (retador.rango !== retado.rango) throw new AppError('Deben tener el mismo rango', 422, ErrorCodes.DIFFERENT_RANK);

  const retos_activos = await prisma.challenge.findMany({
    where: {
      OR: [{ retador_id }, { retado_id: retador_id }],
      estado: { in: ['pendiente', 'aceptado', 'en_curso'] },
    },
  });
  const tiene_reto_activo = retos_activos.some(
    (r: { retado_id: string; retador_id: string }) => r.retado_id === data.retado_id || r.retador_id === data.retado_id,
  );
  if (tiene_reto_activo) throw new AppError('Ya existe un reto activo entre ustedes', 422, ErrorCodes.ACTIVE_CHALLENGE_EXISTS);

  const challenge = await prisma.challenge.create({
    data: {
      retador_id,
      retado_id: data.retado_id,
      vehiculo_retador_id: data.vehiculo_retador_id,
      vehiculo_retado_id: vehiculo_retado_activo.id,
      tipo_carrera: data.tipo_carrera,
      estado: 'pendiente',
      ubicacion_acordada: data.ubicacion_acordada ?? null,
      fecha_acordada: data.fecha_acordada ? new Date(data.fecha_acordada) : null,
      notas: data.notas ?? null,
    },
  });

  await prisma.notification.create({
    data: {
      user_id: data.retado_id,
      tipo: 'challenge_received',
      mensaje: `Recibiste un reto de ${retador.username}`,
      referencia_id: challenge.id,
      referencia_tipo: 'challenge',
    },
  });

  emitToUser(data.retado_id, SocketEvents.CHALLENGE_RECEIVED, { challengeId: challenge.id });
  return challenge;
}

export async function acceptChallenge(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Reto no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (challenge.retado_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  if (challenge.estado !== 'pendiente') throw new AppError('Solo se puede aceptar un reto pendiente', 400, ErrorCodes.VALIDATION_ERROR);

  const updated = await prisma.challenge.update({ where: { id: challengeId }, data: { estado: 'aceptado' } });

  const retado = await prisma.user.findUnique({ where: { id: userId } });
  await prisma.notification.create({
    data: {
      user_id: challenge.retador_id,
      tipo: 'challenge_accepted',
      mensaje: `${retado?.username} aceptó tu reto`,
      referencia_id: challengeId,
      referencia_tipo: 'challenge',
    },
  });
  emitToUser(challenge.retador_id, SocketEvents.CHALLENGE_ACCEPTED, { challengeId });
  return updated;
}

export async function rejectChallenge(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Reto no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (challenge.retado_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  if (challenge.estado !== 'pendiente') throw new AppError('Solo se puede rechazar un reto pendiente', 400, ErrorCodes.VALIDATION_ERROR);

  const updated = await prisma.challenge.update({ where: { id: challengeId }, data: { estado: 'rechazado' } });

  const retado = await prisma.user.findUnique({ where: { id: userId } });
  await prisma.notification.create({
    data: {
      user_id: challenge.retador_id,
      tipo: 'challenge_rejected',
      mensaje: `${retado?.username} rechazó tu reto`,
      referencia_id: challengeId,
      referencia_tipo: 'challenge',
    },
  });
  emitToUser(challenge.retador_id, SocketEvents.CHALLENGE_REJECTED, { challengeId });
  return updated;
}

export async function cancelChallenge(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Reto no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (challenge.retador_id !== userId) throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  if (!['pendiente', 'aceptado'].includes(challenge.estado)) {
    throw new AppError('No se puede cancelar un reto en este estado', 400, ErrorCodes.VALIDATION_ERROR);
  }

  await prisma.challenge.update({ where: { id: challengeId }, data: { estado: 'cancelado' } });
  await prisma.user.update({ where: { id: userId }, data: { retos_consecutivos: 0 } });

  const retador = await prisma.user.findUnique({ where: { id: userId } });
  await prisma.notification.create({
    data: {
      user_id: challenge.retado_id,
      tipo: 'challenge_cancelled',
      mensaje: `${retador?.username} canceló el reto contra ti`,
      referencia_id: challengeId,
      referencia_tipo: 'challenge',
    },
  });
  emitToUser(challenge.retado_id, SocketEvents.CHALLENGE_CANCELLED, { challengeId });
}

export async function startChallenge(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Reto no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (challenge.retador_id !== userId && challenge.retado_id !== userId) {
    throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  }
  if (challenge.estado !== 'aceptado') throw new AppError('El reto debe estar aceptado', 400, ErrorCodes.VALIDATION_ERROR);
  return prisma.challenge.update({ where: { id: challengeId }, data: { estado: 'en_curso' } });
}

export async function registerResult(challengeId: string, userId: string, ganador_id: string, notas_resultado?: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Reto no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (challenge.retador_id !== userId && challenge.retado_id !== userId) {
    throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  }
  if (challenge.estado !== 'en_curso') throw new AppError('El reto debe estar en curso', 400, ErrorCodes.VALIDATION_ERROR);
  if (ganador_id !== challenge.retador_id && ganador_id !== challenge.retado_id) {
    throw new AppError('El ganador debe ser uno de los participantes', 400, ErrorCodes.VALIDATION_ERROR);
  }

  const isRetador = userId === challenge.retador_id;
  const updated = await prisma.challenge.update({
    where: { id: challengeId },
    data: {
      ganador_id,
      notas_resultado: notas_resultado ?? null,
      confirmado_retador: isRetador,
      confirmado_retado: !isRetador,
    },
  });

  const otroUserId = isRetador ? challenge.retado_id : challenge.retador_id;
  await prisma.notification.create({
    data: {
      user_id: otroUserId,
      tipo: 'result_pending',
      mensaje: 'Se registró un resultado en tu reto, necesita confirmación',
      referencia_id: challengeId,
      referencia_tipo: 'challenge',
    },
  });
  emitToUser(otroUserId, SocketEvents.CHALLENGE_RESULT_PENDING, { challengeId });
  return updated;
}

export async function confirmResult(challengeId: string, userId: string) {
  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new AppError('Reto no encontrado', 404, ErrorCodes.NOT_FOUND);
  if (challenge.retador_id !== userId && challenge.retado_id !== userId) {
    throw new AppError('Acceso denegado', 403, ErrorCodes.FORBIDDEN);
  }
  if (!challenge.ganador_id) throw new AppError('Primero debe registrarse un resultado', 400, ErrorCodes.VALIDATION_ERROR);

  const isRetador = userId === challenge.retador_id;
  const updated = await prisma.challenge.update({
    where: { id: challengeId },
    data: isRetador ? { confirmado_retador: true } : { confirmado_retado: true },
  });

  if (updated.confirmado_retador && updated.confirmado_retado) {
    await prisma.challenge.update({ where: { id: challengeId }, data: { estado: 'completado' } });

    const ganador = await prisma.user.findUnique({ where: { id: challenge.ganador_id } });
    const perdedor_id = challenge.ganador_id === challenge.retador_id ? challenge.retado_id : challenge.retador_id;
    const perdedor = await prisma.user.findUnique({ where: { id: perdedor_id } });

    if (ganador) {
      const newConsecutivos = ganador.retos_consecutivos + 1;
      await prisma.user.update({
        where: { id: challenge.ganador_id },
        data: { victorias: { increment: 1 }, retos_consecutivos: newConsecutivos },
      });

      const nuevoRango = RANGO_SIGUIENTE[ganador.rango];
      if (newConsecutivos >= 3 && nuevoRango) {
        await prisma.user.update({
          where: { id: challenge.ganador_id },
          data: { rango: nuevoRango as any, retos_consecutivos: 0 },
        });
        await prisma.notification.create({
          data: { user_id: challenge.ganador_id, tipo: 'rank_upgraded', mensaje: `¡Felicidades! Subiste al rango ${nuevoRango}` },
        });
        emitToUser(challenge.ganador_id, SocketEvents.RANK_UPGRADED, { nuevoRango });
      }

      await prisma.notification.create({
        data: {
          user_id: challenge.ganador_id,
          tipo: 'challenge_completed',
          mensaje: `¡Ganaste un reto contra ${perdedor?.username}!`,
          referencia_id: challengeId,
          referencia_tipo: 'challenge',
        },
      });
      emitToUser(challenge.ganador_id, SocketEvents.CHALLENGE_COMPLETED, { challengeId });
    }

    if (perdedor) {
      await prisma.user.update({
        where: { id: perdedor_id },
        data: { derrotas: { increment: 1 }, retos_consecutivos: 0 },
      });
      await prisma.notification.create({
        data: {
          user_id: perdedor_id,
          tipo: 'challenge_lost',
          mensaje: `Perdiste un reto contra ${ganador?.username}`,
          referencia_id: challengeId,
          referencia_tipo: 'challenge',
        },
      });
      emitToUser(perdedor_id, SocketEvents.CHALLENGE_COMPLETED, { challengeId });
    }
  }

  return updated;
}
