import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient(undefined as any);

async function main() {
  const categories = [
    { nombre: 'Stock', descripcion: 'Vehículos sin modificaciones de fábrica' },
    { nombre: 'Modified', descripcion: 'Vehículos con modificaciones menores permitidas' },
    { nombre: 'Pro', descripcion: 'Vehículos altamente modificados para máximo rendimiento' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { nombre: category.nombre },
      update: {},
      create: category,
    });
  }

  console.log('Categorías cargadas:', categories.map((c) => c.nombre).join(', '));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
