export type DataStatus = 'idle' | 'loading' | 'success' | 'error';

export interface DataState<T> {
  status: DataStatus;
  data?: T;
  error?: unknown;
}
