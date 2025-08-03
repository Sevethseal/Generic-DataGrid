export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface SearchParams {
  q: string;
}

export interface FilterParams {
  column: string;
  operator: string;
  value: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
