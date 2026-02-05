import { Observable } from 'rxjs';

export type DataStatus = 'idle' | 'loading' | 'success' | 'error';

export interface DataState<T> {
  status: DataStatus;
  data?: T;
  error?: unknown;
}

export interface DataStateOptions<T = unknown> {
  emitLoadingOnNext?: boolean;
  previousData?: T;
  loadingTrigger$?: Observable<unknown>;
}
