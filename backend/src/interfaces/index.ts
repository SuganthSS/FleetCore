// Base interface definition
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
