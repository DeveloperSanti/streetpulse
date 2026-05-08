export class ApiResponse {
  static success(data: unknown, message = 'Operación completada exitosamente', meta?: Record<string, unknown>) {
    return {
      success: true,
      data,
      message,
      ...(meta && { meta }),
    };
  }

  static error(code: string, message: string, details?: { field: string; message: string }[]) {
    return {
      success: false,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    };
  }
}
