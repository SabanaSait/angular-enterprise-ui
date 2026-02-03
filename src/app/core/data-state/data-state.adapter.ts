import { Observable, of } from 'rxjs';
import { catchError, map, startWith, scan } from 'rxjs/operators';
import { DataState, DataStateOptions } from './data-state.model';
import { loadingState, successSate, errorState } from './data-state.helpers';

export function toDataState<T>(
  source$: Observable<T>,
  options: DataStateOptions,
): Observable<DataState<T>> {
  const { emitLoadingOnNext = false } = options;

  return new Observable<DataState<T>>((subscriber) => {
    let lastSuccessData: T | undefined;

    const subscription = source$.subscribe({
      next: (data) => {
        lastSuccessData = data;
        subscriber.next(successSate(data));
      },
      error: (error) => {
        subscriber.next(errorState(error));
      },
    });

    if (emitLoadingOnNext) {
      subscriber.next(loadingState(lastSuccessData));
    }

    return () => subscription.unsubscribe();
  });
}
