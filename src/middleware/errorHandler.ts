import { NextRequest, NextResponse } from 'next/server';

export interface ErrorHandlerOptions {
  logErrors?: boolean;
  includeStack?: boolean;
}

export function errorHandler(
  error: Error,
  request: NextRequest,
  options: ErrorHandlerOptions = {}
): NextResponse {
  const { logErrors = true, includeStack = false } = options;

  // Log error if enabled
  if (logErrors) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString(),
    });
  }

  // Determine error response
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Invalid request data';
  } else if (error.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (error.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (error.name === 'ForbiddenError') {
    statusCode = 403;
    message = 'Forbidden';
  }

  // Build response body
  const responseBody: any = {
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    },
  };

  // Include stack trace in development
  if (includeStack && process.env.NODE_ENV === 'development') {
    responseBody.error.stack = error.stack;
  }

  return NextResponse.json(responseBody, { status: statusCode });
}

// Async error handler wrapper
export function asyncErrorHandler(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return errorHandler(error as Error, request);
    }
  };
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// Additional utility functions for API handling
export function createApiError(message: string, statusCode: number = 500, code?: string): Error {
  const error = new Error(message);
  error.name = 'ApiError';
  (error as any).statusCode = statusCode;
  (error as any).code = code;
  return error;
}

export async function validateRequestBody<T>(
  request: NextRequest,
  validator: (data: any) => data is T
): Promise<T> {
  try {
    const body = await request.json();
    if (!validator(body)) {
      throw new ValidationError('Invalid request body format');
    }
    return body;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new ValidationError('Invalid JSON in request body');
  }
}

export function createApiHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      return errorHandler(error as Error, request);
    }
  };
}