import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';

const toGlob = (...segments: string[]): string =>
  path.join(...segments).replace(/\\/g, '/');

const swaggerDefinition: swaggerJSDoc.SwaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'StreetPulse API',
    version: '1.0.0',
    description:
      'API REST para la plataforma de carreras callejeras StreetPulse. Permite a los pilotos crear perfiles, registrar vehículos, retar a otros pilotos y participar en un sistema de clasificación por rangos.',
    contact: {
      name: 'StreetPulse Team',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000/v1',
      description: 'Servidor de desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT access token obtenido desde /auth/login o /auth/register',
      },
    },
    schemas: {
      SuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object', nullable: true },
          message: { type: 'string', example: 'Operación completada exitosamente' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VALIDATION_ERROR' },
              message: { type: 'string', example: 'Los datos enviados no son válidos' },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          username: { type: 'string', example: 'racer_x' },
          email: { type: 'string', format: 'email', example: 'racer@example.com' },
          foto_perfil: { type: 'string', format: 'uri', nullable: true },
          rango: { type: 'string', enum: ['S', 'A', 'B', 'C', 'D'] },
          role: { type: 'string', enum: ['piloto', 'administrador'] },
          estado: { type: 'string', enum: ['activo', 'suspendido', 'inactivo'] },
          zona_localidad: { type: 'string', nullable: true },
          zona_ciudad: { type: 'string', nullable: true },
          zona_estado: { type: 'string', nullable: true },
          zona_pais: { type: 'string', nullable: true },
          victorias: { type: 'integer', example: 12 },
          derrotas: { type: 'integer', example: 4 },
          retos_consecutivos: { type: 'integer', example: 2 },
        },
      },
      AuthTokens: {
        type: 'object',
        properties: {
          user: { $ref: '#/components/schemas/User' },
          accessToken: { type: 'string', description: 'JWT con expiración de 1h' },
          refreshToken: { type: 'string', description: 'Refresh token con expiración de 7d' },
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          tipo_vehiculo: { type: 'string', enum: ['auto', 'moto', 'monopatin_electrico'] },
          marca: { type: 'string', example: 'Honda' },
          modelo: { type: 'string', example: 'Civic Type R' },
          anio: { type: 'integer', example: 2023 },
          color: { type: 'string', nullable: true },
          placa: { type: 'string', example: 'ABC123' },
          foto: { type: 'string', format: 'uri', nullable: true },
          modificaciones: { type: 'string', nullable: true },
          activo: { type: 'boolean', example: true },
        },
      },
      Challenge: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          retador_id: { type: 'string', format: 'uuid' },
          retado_id: { type: 'string', format: 'uuid' },
          vehiculo_retador_id: { type: 'string', format: 'uuid' },
          vehiculo_retado_id: { type: 'string', format: 'uuid', nullable: true },
          tipo_carrera: { type: 'string', enum: ['cuarto_milla', 'vueltas', 'derrape'] },
          estado: {
            type: 'string',
            enum: ['pendiente', 'aceptado', 'rechazado', 'en_curso', 'completado', 'cancelado'],
          },
          ganador_id: { type: 'string', format: 'uuid', nullable: true },
          ubicacion_acordada: { type: 'string', nullable: true },
          fecha_acordada: { type: 'string', format: 'date-time', nullable: true },
          notas: { type: 'string', nullable: true },
          notas_resultado: { type: 'string', nullable: true },
          confirmado_retador: { type: 'boolean' },
          confirmado_retado: { type: 'boolean' },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          user_id: { type: 'string', format: 'uuid' },
          tipo: { type: 'string' },
          titulo: { type: 'string' },
          mensaje: { type: 'string' },
          leida: { type: 'boolean' },
          referencia_id: { type: 'string', format: 'uuid', nullable: true },
          referencia_tipo: { type: 'string', nullable: true },
        },
      },
    },
    responses: {
      Unauthorized: {
        description: 'Token JWT ausente, inválido o expirado',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      ValidationError: {
        description: 'Los datos enviados no pasaron la validación',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
      NotFound: {
        description: 'El recurso solicitado no existe',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  },
  tags: [
    { name: 'Auth', description: 'Registro, login, logout y refresh de tokens' },
    { name: 'Users', description: 'Gestión del perfil y exploración de pilotos' },
    { name: 'Vehicles', description: 'CRUD de vehículos del piloto autenticado' },
    { name: 'Challenges', description: 'Retos entre pilotos' },
    { name: 'Notifications', description: 'Notificaciones del piloto' },
    { name: 'Ranks', description: 'Sistema de rangos y leaderboards' },
  ],
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: [
    toGlob(__dirname, '..', 'routes', '*.ts'),
    toGlob(__dirname, '..', 'routes', '*.js'),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
