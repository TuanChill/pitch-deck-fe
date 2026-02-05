/**
 * Common API Response Types
 *
 * Discriminated union-based API response wrapper with type-safe success/error handling.
 */

// ==================== Success Response Type ====================

/**
 * Success response shape
 * @template T - Type of data returned on success
 */
export type ApiSuccess<T> = {
  success: true;
  data?: T;
  message?: string;
  statusCode: number;
  meta?: ResponseMeta;
  error?: never;
};

// ==================== Error Response Type ====================

/**
 * Error details structure
 */
export type ApiErrorDetails = {
  code?: string;
  grpcCode?: number;
  details?: Record<string, unknown>;
  stack?: string;
};

/**
 * Error response shape
 */
export type ApiError = {
  success: false;
  message?: string;
  statusCode: number;
  error: ApiErrorDetails;
};

// ==================== Response Meta ====================

/**
 * Pagination/response metadata
 */
export type ResponseMeta = {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  hasMore?: boolean;
  [key: string]: unknown;
};

// ==================== Legacy Meta Data ====================

/**
 * @deprecated Use ResponseMeta instead for consistency
 */
export type MetaData = {
  total: number;
  page: number;
  pageSize: number;
};

// ==================== API Response Union ====================

/**
 * Discriminated union for API responses
 * Use `response.success` to narrow between ApiSuccess and ApiError
 *
 * @example
 * ```ts
 * const response = await someApiCall();
 *
 * if (response.success) {
 *   // TypeScript knows: response.data is T, response.error is never
 *   console.log(response.data);
 * } else {
 *   // TypeScript knows: response.error is ApiErrorDetails, response.data is never
 *   console.error(response.error);
 * }
 * ```
 */
export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ==================== API Response Builder ====================

/**
 * Helper class for creating typed API responses
 * Provides static factory methods for success and error responses
 *
 * @example
 * ```ts
 * // Success response
 * const success = ApiResponseBuilder.success<User>(userData, {
 *   statusCode: 200,
 *   message: 'User created successfully'
 * });
 *
 * // Error response
 * const error = ApiResponseBuilder.error({
 *   statusCode: 404,
 *   message: 'User not found',
 *   code: 'USER_NOT_FOUND'
 * });
 * ```
 */
export class ApiResponseBuilder {
  private constructor() {
    // Static class - prevent instantiation
  }

  /**
   * Create a success response
   * @param data - Response payload
   * @param options - Additional response options
   * @returns Success response object
   */
  static success<T>(
    data?: T,
    options?: {
      message?: string;
      statusCode?: number;
      meta?: ResponseMeta;
    }
  ): ApiSuccess<T> {
    return {
      success: true,
      data,
      message: options?.message,
      statusCode: options?.statusCode ?? 200,
      meta: options?.meta
    };
  }

  /**
   * Create an error response
   * @param options - Error response options
   * @returns Error response object
   */
  static error(options: {
    message?: string;
    statusCode: number;
    code?: string;
    grpcCode?: number;
    details?: Record<string, unknown>;
    stack?: string;
  }): ApiError {
    return {
      success: false,
      message: options.message,
      statusCode: options.statusCode,
      error: {
        code: options.code,
        grpcCode: options.grpcCode,
        details: options.details,
        stack: options.stack
      }
    };
  }

  /**
   * Type guard to check if response is successful
   * @param response - Response to check
   * @returns True if response is successful
   */
  static isSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
    return response.success === true;
  }

  /**
   * Type guard to check if response is an error
   * @param response - Response to check
   * @returns True if response is an error
   */
  static isError<T>(response: ApiResponse<T>): response is ApiError {
    return response.success === false;
  }
}

// ==================== Utility Types ====================

/**
 * Extract data type from an ApiResponse union
 * @template T - The ApiResponse type
 */
export type ResponseData<T> = T extends ApiSuccess<infer D> ? D : never;

/**
 * Extract error type from an ApiResponse union
 */
export type ResponseError = ApiError['error'];
