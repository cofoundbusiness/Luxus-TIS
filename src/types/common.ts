export type ID = string;
export type ISODateString = string;
export type Currency = number;
export type Percentage = number;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
