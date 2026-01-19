import { Signal } from '@angular/core';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataState, DataStateOptions } from './data-state.model';
import { toDataState } from './data-state.adapter';
import { loadingState } from './data-state.helpers';

export function toDataStateSignal<T>(
  source$: Observable<T>,
  options: DataStateOptions
): Signal<DataState<T>> {
  const state$ = toDataState(source$, options);

  return toSignal(state$, {
    initialValue: loadingState<T>(),
  });
}
