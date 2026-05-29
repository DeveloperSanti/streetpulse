import { PrismaClient, type Rango, type TipoVehiculo, type TipoCarrera, type EstadoReto } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const PASSWORD_HASH = bcrypt.hashSync('clave12345', 12);

const baseZona = {
  zona_ciudad: 'Medellín',
  zona_estado: 'Antioquia',
  zona_pais: 'Colombia',
};

async function main() {
  console.log('🧹 Limpiando tablas...');
  await prisma.notification.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();

  console.log('📚 Cargando categorías...');
  await prisma.category.createMany({
    data: [
      { nombre: 'Stock', descripcion: 'Vehículos sin modificaciones de fábrica' },
      { nombre: 'Modified', descripcion: 'Vehículos con modificaciones menores permitidas' },
      { nombre: 'Pro', descripcion: 'Vehículos altamente modificados para máximo rendimiento' },
    ],
  });

  console.log('🏁 Creando pilotos paisas...');

  // ----- Pilotos por rango -----
  // RANGO S — La élite de Medellín
  const elDiablo = await crearPiloto({
    username: 'carlos_lopez',
    email: 'carlos@streetpulse.com',
    rango: 'S',
    localidad: 'Las Vegas',
    ciudad: 'Envigado',
    victorias: 47,
    derrotas: 8,
    consecutivos: 5,
  });

  // RANGO A
  const tatiana = await crearPiloto({
    username: 'andrea_gomez',
    email: 'andrea@streetpulse.com',
    rango: 'A',
    localidad: 'Estadio',
    victorias: 28,
    derrotas: 12,
    consecutivos: 2,
  });

  const juanPablo = await crearPiloto({
    username: 'sebastian_torres',
    email: 'sebastian@streetpulse.com',
    rango: 'A',
    localidad: 'Provenza',
    victorias: 31,
    derrotas: 15,
    consecutivos: 1,
  });

  // RANGO B
  const laNegra = await crearPiloto({
    username: 'laura_ramirez',
    email: 'laura@streetpulse.com',
    rango: 'B',
    localidad: 'Belén Rincón',
    victorias: 18,
    derrotas: 10,
    consecutivos: 2,
  });

  const nicolas = await crearPiloto({
    username: 'nicolas_perez',
    email: 'nicolas@streetpulse.com',
    rango: 'B',
    localidad: 'Robledo Pajarito',
    victorias: 22,
    derrotas: 11,
    consecutivos: 0,
  });

  // RANGO C
  const carolina = await crearPiloto({
    username: 'camila_vargas',
    email: 'camila@streetpulse.com',
    rango: 'C',
    localidad: 'Castilla',
    victorias: 12,
    derrotas: 8,
    consecutivos: 1,
  });

  const andres = await crearPiloto({
    username: 'daniel_arias',
    email: 'daniel@streetpulse.com',
    rango: 'C',
    localidad: 'Aranjuez',
    victorias: 14,
    derrotas: 9,
    consecutivos: 0,
  });

  // RANGO D — donde arranca todo el mundo
  const piloto1 = await crearPiloto({
    username: 'piloto1',
    email: 'p1@test.com',
    rango: 'D',
    localidad: 'Manrique Central',
    victorias: 1,
    derrotas: 2,
    consecutivos: 0,
  });

  const mariana = await crearPiloto({
    username: 'mateo_castro',
    email: 'mateo@streetpulse.com',
    rango: 'D',
    localidad: 'Manrique Oriental',
    victorias: 2,
    derrotas: 3,
    consecutivos: 0,
  });

  const jefferson = await crearPiloto({
    username: 'tomas_rivera',
    email: 'tomas@streetpulse.com',
    rango: 'D',
    localidad: 'San Javier La Loma',
    victorias: 0,
    derrotas: 1,
    consecutivos: 0,
  });

  const veronica = await crearPiloto({
    username: 'valentina_mejia',
    email: 'valentina@streetpulse.com',
    rango: 'D',
    localidad: 'La América',
    victorias: 3,
    derrotas: 1,
    consecutivos: 1,
  });

  // CASOS BORDE para testear errores
  const sinVehiculo = await crearPiloto({
    username: 'sofia_henao',
    email: 'sofia@streetpulse.com',
    rango: 'D',
    localidad: 'El Centro',
    victorias: 0,
    derrotas: 0,
    consecutivos: 0,
  });

  const maxVehiculos = await crearPiloto({
    username: 'manuela_jaramillo',
    email: 'manuela@streetpulse.com',
    rango: 'D',
    localidad: 'Doce de Octubre',
    victorias: 0,
    derrotas: 0,
    consecutivos: 0,
  });

  const sinActivo = await crearPiloto({
    username: 'isabella_ospina',
    email: 'isabella@streetpulse.com',
    rango: 'D',
    localidad: 'Buenos Aires',
    victorias: 0,
    derrotas: 0,
    consecutivos: 0,
  });

  console.log('🚗 Asignando vehículos...');

  // RANGO S — el diablo tiene una moto fuerte
  const vDiabloMoto = await crearVehiculo({
    userId: elDiablo.id,
    tipo: 'moto',
    marca: 'Kawasaki',
    modelo: 'Ninja ZX-6R',
    anio: 2023,
    color: 'Verde',
    placa: 'DBL01M',
    modificaciones: 'Escape Akrapovic, ECU mapeada, slipper clutch',
    activo: true,
  });

  // RANGO A — autos modificados
  const vTatianaAuto = await crearVehiculo({
    userId: tatiana.id,
    tipo: 'auto',
    marca: 'Mazda',
    modelo: 'Mazdaspeed 3',
    anio: 2019,
    color: 'Blanco',
    placa: 'TAT01A',
    modificaciones: 'Turbo K04, intercooler frontal, coilovers',
    activo: true,
  });

  const vJuanPaAuto = await crearVehiculo({
    userId: juanPablo.id,
    tipo: 'auto',
    marca: 'Volkswagen',
    modelo: 'Polo GTI',
    anio: 2021,
    color: 'Rojo',
    placa: 'JPB01A',
    modificaciones: 'Stage 2 APR, downpipe, intake',
    activo: true,
  });

  // RANGO B — motos
  const vNegraMoto = await crearVehiculo({
    userId: laNegra.id,
    tipo: 'moto',
    marca: 'Yamaha',
    modelo: 'FZ 250',
    anio: 2022,
    color: 'Azul',
    placa: 'NGR01M',
    modificaciones: 'Exhaust Yoshimura, filtro K&N',
    activo: true,
  });

  const vNicoMoto = await crearVehiculo({
    userId: nicolas.id,
    tipo: 'moto',
    marca: 'Bajaj',
    modelo: 'Pulsar NS 200',
    anio: 2023,
    color: 'Negro',
    placa: 'NCO01M',
    modificaciones: 'Reprogramación ECU, escape libre',
    activo: true,
  });

  // RANGO C — mix
  const vCaroAuto = await crearVehiculo({
    userId: carolina.id,
    tipo: 'auto',
    marca: 'Chevrolet',
    modelo: 'Aveo Emotion',
    anio: 2018,
    color: 'Plata',
    placa: 'CRO01A',
    activo: true,
  });

  const vAndresMoto = await crearVehiculo({
    userId: andres.id,
    tipo: 'moto',
    marca: 'Honda',
    modelo: 'CB 190R',
    anio: 2021,
    color: 'Rojo',
    placa: 'AND01M',
    activo: true,
  });

  // RANGO D — donde se da la acción de prueba
  const vPiloto1Moto = await crearVehiculo({
    userId: piloto1.id,
    tipo: 'moto',
    marca: 'Bajaj',
    modelo: 'Pulsar NS 160',
    anio: 2023,
    color: 'Negro Mate',
    placa: 'PIL01M',
    modificaciones: 'Stock',
    activo: true,
  });

  const vMarianaMoto = await crearVehiculo({
    userId: mariana.id,
    tipo: 'moto',
    marca: 'Yamaha',
    modelo: 'XTZ 125',
    anio: 2022,
    color: 'Azul',
    placa: 'MAR01M',
    activo: true,
  });

  const vJeffMoto = await crearVehiculo({
    userId: jefferson.id,
    tipo: 'moto',
    marca: 'AKT',
    modelo: 'NKD 125',
    anio: 2020,
    color: 'Rojo',
    placa: 'JEF01M',
    activo: true,
  });

  const vVeroAuto = await crearVehiculo({
    userId: veronica.id,
    tipo: 'auto',
    marca: 'Renault',
    modelo: 'Sandero RS',
    anio: 2019,
    color: 'Naranja',
    placa: 'VER01A',
    activo: true,
  });

  // Veronica tiene un segundo vehículo NO activo
  await crearVehiculo({
    userId: veronica.id,
    tipo: 'monopatin_electrico',
    marca: 'Xiaomi',
    modelo: 'Mi Pro 2',
    anio: 2023,
    color: 'Negro',
    placa: 'VER02P',
    activo: false,
  });

  // ----- Caso MAX_VEHICLES_REACHED: 5 vehículos -----
  for (let i = 1; i <= 5; i++) {
    await crearVehiculo({
      userId: maxVehiculos.id,
      tipo: i % 2 === 0 ? 'moto' : 'auto',
      marca: ['Chevrolet', 'Bajaj', 'Renault', 'Yamaha', 'Mazda'][i - 1],
      modelo: ['Spark GT', 'Boxer CT 100', 'Sandero', 'YBR 125', 'Mazda 2'][i - 1],
      anio: 2018 + i,
      color: ['Blanco', 'Negro', 'Gris', 'Azul', 'Rojo'][i - 1],
      placa: `MAX0${i}${i % 2 === 0 ? 'M' : 'A'}`,
      activo: i === 1,
    });
  }

  // ----- Caso VEHICLE_NOT_ACTIVE: tiene vehículos pero ninguno activo -----
  await crearVehiculo({
    userId: sinActivo.id,
    tipo: 'moto',
    marca: 'Bajaj',
    modelo: 'Boxer CT 100',
    anio: 2019,
    color: 'Rojo',
    placa: 'INC01M',
    activo: false,
  });
  await crearVehiculo({
    userId: sinActivo.id,
    tipo: 'auto',
    marca: 'Hyundai',
    modelo: 'Accent',
    anio: 2017,
    color: 'Gris',
    placa: 'INC02A',
    activo: false,
  });

  // sinVehiculo no recibe ningún vehículo (NO_VEHICLE_REGISTERED)

  console.log('🏎️  Creando retos en distintos estados...');

  // 1. PENDIENTE — piloto1 retó a mariana (sirve para ACTIVE_CHALLENGE_EXISTS si intentás otro reto)
  await crearReto({
    retador: piloto1,
    retado: mariana,
    vehiculoRetador: vPiloto1Moto,
    vehiculoRetado: vMarianaMoto,
    tipo: 'cuarto_milla',
    estado: 'pendiente',
    ubicacion: 'Vía a Las Palmas, sector El Tablazo',
    fecha: addDays(2),
    notas: 'Larga distancia, salida limpia',
  });

  // 2. ACEPTADO — tatiana y juan pa, ambos rango A
  await crearReto({
    retador: tatiana,
    retado: juanPablo,
    vehiculoRetador: vTatianaAuto,
    vehiculoRetado: vJuanPaAuto,
    tipo: 'cuarto_milla',
    estado: 'aceptado',
    ubicacion: 'Carrera 70 con Avenida Colombia',
    fecha: addDays(1),
    notas: 'Apuesta caballera, sin trampa',
  });

  // 3. EN_CURSO sin resultado — la negra vs nico, rango B
  await crearReto({
    retador: laNegra,
    retado: nicolas,
    vehiculoRetador: vNegraMoto,
    vehiculoRetado: vNicoMoto,
    tipo: 'derrape',
    estado: 'en_curso',
    ubicacion: 'Parqueadero del Aeropuerto Olaya Herrera',
    fecha: new Date(),
  });

  // 4. EN_CURSO con resultado pendiente de confirmar — carolina vs andres, rango C
  await crearReto({
    retador: carolina,
    retado: andres,
    vehiculoRetador: vCaroAuto,
    vehiculoRetado: vAndresMoto,
    tipo: 'vueltas',
    estado: 'en_curso',
    ubicacion: 'Avenida 33 con Avenida El Poblado',
    fecha: addDays(-1),
    ganadorId: carolina.id,
    notasResultado: 'Pico arriba de 1s. Ganó por las curvas.',
    confirmadoRetador: true,
    confirmadoRetado: false,
  });

  // 5. COMPLETADO — piloto1 ganó hace una semana contra veronica
  await crearReto({
    retador: veronica,
    retado: piloto1,
    vehiculoRetador: vVeroAuto,
    vehiculoRetado: vPiloto1Moto,
    tipo: 'cuarto_milla',
    estado: 'completado',
    ubicacion: 'Vía a San Antonio de Prado',
    fecha: addDays(-7),
    ganadorId: piloto1.id,
    notasResultado: 'Moto le sacó al sandero. Increíble largada.',
    confirmadoRetador: true,
    confirmadoRetado: true,
  });

  // 6. RECHAZADO — jefferson rechazó a piloto1
  await crearReto({
    retador: piloto1,
    retado: jefferson,
    vehiculoRetador: vPiloto1Moto,
    vehiculoRetado: vJeffMoto,
    tipo: 'derrape',
    estado: 'rechazado',
    ubicacion: 'Vía Las Vegas, Envigado',
    fecha: addDays(-2),
    notas: 'Quiero ver qué tan rápida es la AKT',
  });

  // 7. CANCELADO — andres canceló contra carolina
  await crearReto({
    retador: andres,
    retado: carolina,
    vehiculoRetador: vAndresMoto,
    vehiculoRetado: vCaroAuto,
    tipo: 'vueltas',
    estado: 'cancelado',
    ubicacion: 'Calle 10, Provenza',
    fecha: addDays(-3),
  });

  console.log('🔔 Creando notificaciones para piloto1...');

  await prisma.notification.createMany({
    data: [
      {
        user_id: piloto1.id,
        tipo: 'challenge:received',
        titulo: 'Nuevo reto recibido',
        mensaje: `${mariana.username} te retó a una carrera de cuarto de milla.`,
        leida: false,
      },
      {
        user_id: piloto1.id,
        tipo: 'challenge:rejected',
        titulo: 'Reto rechazado',
        mensaje: `${jefferson.username} rechazó tu reto.`,
        leida: false,
      },
      {
        user_id: piloto1.id,
        tipo: 'challenge:completed',
        titulo: 'Reto completado',
        mensaje: `Le ganaste a ${veronica.username} en cuarto de milla. ¡+1 victoria!`,
        leida: true,
      },
      {
        user_id: piloto1.id,
        tipo: 'rank:upgraded',
        titulo: 'Bienvenido a StreetPulse',
        mensaje: 'Iniciás en rango D. Sumá 3 victorias seguidas para subir a C.',
        leida: true,
      },
    ],
  });

  console.log('\n✅ Seed completo.\n');
  console.log('Cuentas (password de todos: clave12345):');
  console.log('  • piloto1 / p1@test.com (D) — usuario de prueba con retos activos');
  console.log('  • carlos_lopez / carlos@streetpulse.com (S)');
  console.log('  • andrea_gomez / andrea@streetpulse.com (A)');
  console.log('  • mateo_castro / mateo@streetpulse.com (D) — reto pendiente con piloto1');
  console.log('  • sofia_henao / sofia@streetpulse.com (D) — sin vehículos');
  console.log('  • manuela_jaramillo / manuela@streetpulse.com (D) — con 5 vehículos (límite)');
  console.log('  • isabella_ospina / isabella@streetpulse.com (D) — vehículos inactivos');
  console.log('');
}

// ---------- helpers ----------

async function crearPiloto(input: {
  username: string;
  email: string;
  rango: Rango;
  localidad: string;
  ciudad?: string;
  victorias: number;
  derrotas: number;
  consecutivos: number;
}) {
  return prisma.user.create({
    data: {
      username: input.username,
      email: input.email,
      password: PASSWORD_HASH,
      rango: input.rango,
      zona_localidad: input.localidad,
      zona_ciudad: input.ciudad ?? baseZona.zona_ciudad,
      zona_estado: baseZona.zona_estado,
      zona_pais: baseZona.zona_pais,
      victorias: input.victorias,
      derrotas: input.derrotas,
      retos_consecutivos: input.consecutivos,
    },
  });
}

async function crearVehiculo(input: {
  userId: string;
  tipo: TipoVehiculo;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  placa: string;
  modificaciones?: string;
  activo: boolean;
}) {
  return prisma.vehicle.create({
    data: {
      user_id: input.userId,
      tipo_vehiculo: input.tipo,
      marca: input.marca,
      modelo: input.modelo,
      anio: input.anio,
      color: input.color,
      placa: input.placa,
      modificaciones: input.modificaciones,
      activo: input.activo,
    },
  });
}

async function crearReto(input: {
  retador: { id: string };
  retado: { id: string };
  vehiculoRetador: { id: string };
  vehiculoRetado: { id: string };
  tipo: TipoCarrera;
  estado: EstadoReto;
  ubicacion?: string;
  fecha?: Date;
  notas?: string;
  ganadorId?: string;
  notasResultado?: string;
  confirmadoRetador?: boolean;
  confirmadoRetado?: boolean;
}) {
  return prisma.challenge.create({
    data: {
      retador_id: input.retador.id,
      retado_id: input.retado.id,
      vehiculo_retador_id: input.vehiculoRetador.id,
      vehiculo_retado_id: input.vehiculoRetado.id,
      tipo_carrera: input.tipo,
      estado: input.estado,
      ubicacion_acordada: input.ubicacion,
      fecha_acordada: input.fecha,
      notas: input.notas,
      ganador_id: input.ganadorId,
      notas_resultado: input.notasResultado,
      confirmado_retador: input.confirmadoRetador ?? false,
      confirmado_retado: input.confirmadoRetado ?? false,
    },
  });
}

function addDays(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
