import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: string;
  label: string;
  sortField?: string;
  filterType?: 'text' | 'daterange';
  filterKey?: string;
  render: (row: T) => ReactNode;
}

export interface TableParams {
  page: number;
  size: number;
  sort: string;
  direction: 'ASC' | 'DESC';
  filters: Record<string, string>;
}

export interface TablePage<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
