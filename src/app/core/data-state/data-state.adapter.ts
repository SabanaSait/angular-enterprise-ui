import { Observable } from 'rxjs';
import { DataState, DataStateOptions } from './data-state.model';
import { loadingState, successState, errorState } from './data-state.helpers';

export function toDataState<T>(
  source$: Observable<T>,
  options: DataStateOptions<T>,
): Observable<DataState<T>> {
  const { emitLoadingOnNext = false, previousData, loadingTrigger$ } = options;

  return new Observable<DataState<T>>((subscriber) => {
    let lastSuccessData: T | undefined = previousData;

    const sourceSubscription = source$.subscribe({
      next: (data) => {
        if (emitLoadingOnNext) {
          subscriber.next(loadingState(lastSuccessData));
        }
        lastSuccessData = data;
        subscriber.next(successState(data));
      },
      error: (error) => {
        subscriber.next(errorState(error));
      },
    });

    let triggerSubscription: { unsubscribe: () => void } | undefined;
    if (loadingTrigger$) {
      triggerSubscription = loadingTrigger$.subscribe(() => {
        subscriber.next(loadingState(lastSuccessData));
      });
    }

    if (emitLoadingOnNext) {
      subscriber.next(loadingState(lastSuccessData));
    }

    return () => {
      sourceSubscription.unsubscribe();
      triggerSubscription?.unsubscribe();
    };
  });
}
