import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { toDataStateSignal } from './data-state.signal';

describe('toDataStateSignal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create a signal with initial loading state', () => {
    const subject = new Subject<string>();
    const signal = TestBed.runInInjectionContext(() => toDataStateSignal(subject, {}));

    const initialState = signal();
    expect(initialState).toEqual({
      status: 'loading',
    });
  });

  it('should update signal to success state on successful emission', async () => {
    const subject = new Subject<string>();
    const signal = TestBed.runInInjectionContext(() => toDataStateSignal(subject, {}));

    // Initial loading state
    expect(signal()).toEqual({
      status: 'loading',
    });

    // Emit data
    subject.next('test data');

    await new Promise((resolve) => setTimeout(resolve, 10));

    const state = signal();
    expect(state).toEqual({
      status: 'success',
      data: 'test data',
    });
  });

  it('should update signal to error state on error', async () => {
    const subject = new Subject<string>();
    const signal = TestBed.runInInjectionContext(() => toDataStateSignal(subject, {}));

    expect(signal()).toEqual({
      status: 'loading',
    });

    subject.error('test error');
    await new Promise((resolve) => setTimeout(resolve, 10));

    const state = signal();
    expect(state).toEqual({
      status: 'error',
      error: 'test error',
    });
  });

  it('should handle loading state with previous data when emitLoadingOnNext is true', async () => {
    const subject = new Subject<string>();
    const signal = TestBed.runInInjectionContext(() =>
      toDataStateSignal(subject, { emitLoadingOnNext: true }),
    );

    // Initial state should be loading
    expect(signal()).toEqual({
      status: 'loading',
    });

    // Emit first value
    subject.next('first data');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(signal()).toEqual({
      status: 'success',
      data: 'first data',
    });

    // Emit second value - since emitLoadingOnNext is true, it should emit loading then success
    subject.next('second data');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(signal()).toEqual({
      status: 'success',
      data: 'second data',
    });
  });

  it('should handle multiple emissions correctly', async () => {
    const subject = new Subject<number>();
    const signal = TestBed.runInInjectionContext(() => toDataStateSignal(subject, {}));

    // Initial loading state
    expect(signal()).toEqual({
      status: 'loading',
    });

    // First emission
    subject.next(1);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(signal()).toEqual({
      status: 'success',
      data: 1,
    });

    // Second emission
    subject.next(2);
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(signal()).toEqual({
      status: 'success',
      data: 2,
    });
  });

  it('should handle error after success', async () => {
    const subject = new Subject<string>();
    const signal = TestBed.runInInjectionContext(() => toDataStateSignal(subject, {}));

    // Initial loading
    expect(signal()).toEqual({
      status: 'loading',
    });

    // Success
    subject.next('success');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(signal()).toEqual({
      status: 'success',
      data: 'success',
    });

    // Error
    subject.error('test error');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(signal()).toEqual({
      status: 'error',
      error: 'test error',
    });
  });

  it('should work with different data types', async () => {
    const stringSubject = new Subject<string>();
    const numberSubject = new Subject<number>();
    const objectSubject = new Subject<{ id: number }>();

    const stringSignal = TestBed.runInInjectionContext(() => toDataStateSignal(stringSubject, {}));
    const numberSignal = TestBed.runInInjectionContext(() => toDataStateSignal(numberSubject, {}));
    const objectSignal = TestBed.runInInjectionContext(() => toDataStateSignal(objectSubject, {}));

    stringSubject.next('string');
    numberSubject.next(42);
    objectSubject.next({ id: 1 });

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(stringSignal()).toEqual({ status: 'success', data: 'string' });
    expect(numberSignal()).toEqual({ status: 'success', data: 42 });
    expect(objectSignal()).toEqual({ status: 'success', data: { id: 1 } });
  });

  it('should handle emitLoadingOnNext false', async () => {
    const subject = new Subject<string>();
    const signal = TestBed.runInInjectionContext(() =>
      toDataStateSignal(subject, { emitLoadingOnNext: false }),
    );

    // Initial loading state
    expect(signal()).toEqual({
      status: 'loading',
    });

    // Emit value - should go directly to success without intermediate loading
    subject.next('data');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(signal()).toEqual({
      status: 'success',
      data: 'data',
    });
  });
});
