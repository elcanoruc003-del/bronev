/**
 * Enterprise Error Handling
 */

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

/**
 * Format error response
 */
export function formatErrorResponse(error: any) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        details: error.details,
      },
      statusCode: error.statusCode,
    };
  }

  // Prisma errors
  if (error.code === 'P2002') {
    return {
      success: false,
      error: {
        message: 'Record already exists',
        code: 'DUPLICATE',
      },
      statusCode: 409,
    };
  }

  if (error.code === 'P2025') {
    return {
      success: false,
      error: {
        message: 'Record not found',
        code: 'NOT_FOUND',
      },
      statusCode: 404,
    };
  }

  // Generic error
  console.error('Unhandled error:', error);
  return {
    success: false,
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    statusCode: 500,
  };
}

/**
 * Async error wrapper for server actions
 */
export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const formatted = formatErrorResponse(error);
      return {
        success: false,
        error: formatted.error.message,
      };
    }
  };
}
