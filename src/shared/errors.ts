export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly code: string,
    public readonly details?: { field: string; message: string }[]
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const ErrorCodes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  EMAIL_TAKEN: 'EMAIL_TAKEN',
  USERNAME_TAKEN: 'USERNAME_TAKEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SAME_USER: 'SAME_USER',
  DIFFERENT_RANK: 'DIFFERENT_RANK',
  DIFFERENT_VEHICLE_TYPE: 'DIFFERENT_VEHICLE_TYPE',
  ACTIVE_CHALLENGE_EXISTS: 'ACTIVE_CHALLENGE_EXISTS',
  NO_VEHICLE_REGISTERED: 'NO_VEHICLE_REGISTERED',
  VEHICLE_NOT_ACTIVE: 'VEHICLE_NOT_ACTIVE',
  MAX_VEHICLES_REACHED: 'MAX_VEHICLES_REACHED',
} as const;
