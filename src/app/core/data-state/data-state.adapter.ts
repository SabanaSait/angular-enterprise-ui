import { Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from './data-state.model';
import { loadingState, successSate, errorState } from './data-state.helpers';

export function toDataState<T>(source$: Observable<T>): Observable<DataState<T>> {
  return source$.pipe(
    map((data) => successSate<T>(data)),
    startWith(loadingState<T>()),
    catchError((error) => of(errorState<T>(error)))
  );
}
