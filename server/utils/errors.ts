export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly errors: any[] | Record<string, any> | null;

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    errors: any[] | Record<string, any> | null = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors: any[] | Record<string, any> | null = null) {
    super(message, 400, 'VALIDATION_ERROR', errors);
  }
}

export class AIProviderError extends AppError {
  constructor(message: string, provider: string, originalError?: any) {
    super(
      `AI Provider '${provider}' failed: ${message}`,
      502,
      'AI_PROVIDER_ERROR',
      originalError ? { provider, rawError: String(originalError) } : { provider }
    );
  }
}

export class TimeoutError extends AppError {
  constructor(message: string, timeoutMs?: number) {
    super(message, 504, 'TIMEOUT_ERROR', timeoutMs ? { timeoutMs } : null);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class BusinessError extends AppError {
  constructor(message: string, code = 'BUSINESS_RULE_VIOLATION', errors: any[] | Record<string, any> | null = null) {
    super(message, 422, code, errors);
  }
}
