import type { components, paths } from './api.types';

type Schemas = components['schemas'];

export type User = Schemas['User'];
export type AuthTokens = Schemas['AuthTokens'];
export type Vehicle = Schemas['Vehicle'];
export type Challenge = Schemas['Challenge'];
export type Notification = Schemas['Notification'];
export type SuccessResponse = Schemas['SuccessResponse'];
export type ErrorResponse = Schemas['ErrorResponse'];

export type Rango = NonNullable<User['rango']>;
export type TipoVehiculo = NonNullable<Vehicle['tipo_vehiculo']>;
export type TipoCarrera = NonNullable<Challenge['tipo_carrera']>;
export type EstadoChallenge = NonNullable<Challenge['estado']>;

export type ApiSuccess<T> = SuccessResponse & { data?: T };

export type { components, paths };
