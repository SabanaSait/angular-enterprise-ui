import { of, throwError, Subject, firstValueFrom } from 'rxjs';
import { toDataState } from './data-state.adapter';
import { DataState } from './data-state.model';

describe('toDataState', () => {
  it('should emit success state on successful emission', async () => {
    const source$ = of('test data');

    const result$ = toDataState(source$, {});

    const state = await firstValueFrom(result$);
    expect(state).toEqual({
      status: 'success',
      data: 'test data',
    });
  });

  it('should emit error state on error', async () => {
    const error = new Error('Test error');
    const source$ = throwError(() => error);

    const result$ = toDataState(source$, {});
    const state = await firstValueFrom(result$);

    expect(state).toEqual({
      status: 'error',
      error,
    });
  });

  it('should emit loading state initially when emitLoadingOnNext is true', async () => {
    const subject = new Subject<string>();

    const result$ = toDataState(subject, { emitLoadingOnNext: true });
    const states: DataState<string>[] = [];

    const subscription = result$.subscribe((state) => states.push(state));

    // Loading state should be emitted immediately
    expect(states).toEqual([{ status: 'loading' }]);

    // Now emit data
    subject.next('test data');

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(states).toEqual([
      { status: 'loading' },
      { status: 'loading' },
      { status: 'success', data: 'test data' },
    ]);
    subscription.unsubscribe();
  });

  it('should emit loading state with last success data when emitLoadingOnNext is true', async () => {
    const subject = new Subject<string>();
    const result$ = toDataState(subject, { emitLoadingOnNext: true, previousData: 'initial data' });
    const states: DataState<string>[] = [];

    const subscription = result$.subscribe((state) => states.push(state));

    // Initial loading with previous data
    expect(states).toEqual([{ status: 'loading', data: 'initial data' }]);

    // First emission
    subject.next('first data');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(states).toEqual([
      { status: 'loading', data: 'initial data' },
      { status: 'loading', data: 'initial data' },
      { status: 'success', data: 'first data' },
    ]);

    subscription.unsubscribe();
  });

  it('should not emit loading state when emitLoadingOnNext is false', async () => {
    const source$ = of('test data');

    const result$ = toDataState(source$, { emitLoadingOnNext: false });
    const states: DataState<string>[] = [];

    result$.subscribe((state) => states.push(state));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(states).toEqual([{ status: 'success', data: 'test data' }]);
  });

  it('should handle multiple emissions correctly', async () => {
    const subject = new Subject<number>();
    const result$ = toDataState(subject, {});
    const states: DataState<number>[] = [];

    result$.subscribe((state) => states.push(state));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(states).toEqual([
      { status: 'success', data: 1 },
      { status: 'success', data: 2 },
      { status: 'success', data: 3 },
    ]);
  });

  it('should handle error after success', async () => {
    const subject = new Subject<string>();
    const result$ = toDataState(subject, {});
    const states: DataState<string>[] = [];

    result$.subscribe((state) => states.push(state));

    subject.next('success');
    subject.error('test error');

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(states).toEqual([
      { status: 'success', data: 'success' },
      { status: 'error', error: 'test error' },
    ]);
  });

  it('should unsubscribe from source when unsubscribed', () => {
    const subject = new Subject<string>();
    const result$ = toDataState(subject, {});
    const subscription = result$.subscribe(() => {});

    expect(subject.observers.length).toBe(1);

    subscription.unsubscribe();

    expect(subject.observers.length).toBe(0);
  });

  it('should default emitLoadingOnNext to false', async () => {
    const source$ = of('test data');

    const result$ = toDataState(source$, {});
    const states: DataState<string>[] = [];

    result$.subscribe((state) => states.push(state));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(states).toEqual([{ status: 'success', data: 'test data' }]);
  });

  it('should emit loading state when loadingTrigger$ emits', async () => {
    const subject = new Subject<string>();
    const triggerSubject = new Subject<void>();
    const result$ = toDataState(subject, { loadingTrigger$: triggerSubject });
    const states: DataState<string>[] = [];

    const subscription = result$.subscribe((state) => states.push(state));

    // Trigger loading
    triggerSubject.next();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(states).toEqual([{ status: 'loading' }]);

    // Emit data
    subject.next('test data');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(states).toEqual([{ status: 'loading' }, { status: 'success', data: 'test data' }]);

    // Trigger loading again
    triggerSubject.next();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(states).toEqual([
      { status: 'loading' },
      { status: 'success', data: 'test data' },
      { status: 'loading', data: 'test data' },
    ]);

    subscription.unsubscribe();
  });
});
