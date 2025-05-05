export interface ApiResponse<T> {
  code: string;
  message: string;
  data?: T | null;
}

export interface ErrorResponse {
  errorCode: string;
  errorMessage: string;
  validation?: Record<string, string>;
}
