import { prisma } from '../lib/prisma';

export function listRanks() {
  return [
    { rango: 'S', nombre: 'Leyenda', requisitos: '3+ victorias consecutivas en Rango A' },
    { rango: 'A', nombre: 'Élite', requisitos: '3+ victorias consecutivas en Rango B' },
    { rango: 'B', nombre: 'Experto', requisitos: '3+ victorias consecutivas en Rango C' },
    { rango: 'C', nombre: 'Avanzado', requisitos: '3+ victorias consecutivas en Rango D' },
    { rango: 'D', nombre: 'Novato', requisitos: 'Rango inicial para nuevos usuarios' },
  ];
}

export async function getRankLeaderboard(rango: string, page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { rango: rango as any, estado: 'activo' as any };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      where,
      select: { id: true, username: true, rango: true, victorias: true, derrotas: true, zona_ciudad: true },
      orderBy: { victorias: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, limit };
}

export async function getGlobalLeaderboard(page: number, limit: number) {
  const skip = (page - 1) * limit;
  const where = { estado: 'activo' as any };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      where,
      select: { id: true, username: true, rango: true, victorias: true, derrotas: true, zona_ciudad: true },
      orderBy: [{ victorias: 'desc' }, { derrotas: 'asc' }],
    }),
    prisma.user.count({ where }),
  ]);

  return { data, total, page, limit };
}
