/**
 * Custom error class for authentication related errors
 */
export class AuthError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
    this.details = details;
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AuthError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    };
  }
}

/**
 * Custom error class for API related errors
 */
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: any;
  url?: string;
  method?: string;

  constructor(
    message: string, 
    status: number = 500, 
    code?: string, 
    details?: any,
    url?: string,
    method?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.url = url;
    this.method = method;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      url: this.url,
      method: this.method,
    };
  }
}

/**
 * Helper to create an ApiError from an Axios error
 */
export function createApiError(error: any): ApiError {
  if (error.isAxiosError) {
    const { response, config } = error;
    const { status, data } = response || {};
    
    return new ApiError(
      data?.message || error.message || 'An unknown API error occurred',
      status || 0,
      data?.code,
      data?.details,
      config?.url,
      config?.method?.toUpperCase()
    );
  }
  
  if (error instanceof Error) {
    return new ApiError(error.message);
  }
  
  return new ApiError('An unknown error occurred');
}

/**
 * Helper to check if an error is a network error
 */
export function isNetworkError(error: any): boolean {
  return (
    error instanceof Error && 
    (error.message === 'Network Error' || 
     error.message === 'Failed to fetch' ||
     (error as any).code === 'ECONNABORTED' ||
     (error as any).code === 'ECONNRESET')
  );
}

/**
 * Helper to check if an error is an authentication error
 */
export function isAuthError(error: any): error is AuthError {
  return error?.name === 'AuthError' || error?.status === 401;
}

/**
 * Helper to check if an error is a rate limit error
 */
export function isRateLimitError(error: any): boolean {
  return error?.status === 429 || error?.code === 'rate_limited';
}
