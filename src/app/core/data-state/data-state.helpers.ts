import { DataState } from './data-state.model';

export const idleState = <T>(): DataState<T> => ({
  status: 'idle',
});

export const loadingState = <T>(data?: T): DataState<T> => ({
  status: 'loading',
  data,
});

export const successSate = <T>(data: T): DataState<T> => ({
  status: 'success',
  data,
});

export const errorState = <T>(error: T): DataState<T> => ({
  status: 'error',
  error,
});
