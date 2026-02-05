import { idleState, loadingState, successState, errorState } from './data-state.helpers';
import { DataState } from './data-state.model';

describe('data-state helpers', () => {
  describe('idleState', () => {
    it('should create an idle state', () => {
      const result = idleState<string>();

      expect(result).toEqual({
        status: 'idle',
      });
    });

    it('should not have data or error properties', () => {
      const result = idleState<number>();

      expect(result.data).toBeUndefined();
      expect(result.error).toBeUndefined();
    });
  });

  describe('loadingState', () => {
    it('should create a loading state without data', () => {
      const result = loadingState<string>();

      expect(result).toEqual({
        status: 'loading',
      });
    });

    it('should create a loading state with data', () => {
      const data = 'test data';
      const result = loadingState(data);

      expect(result).toEqual({
        status: 'loading',
        data,
      });
    });
  });

  describe('successState', () => {
    it('should create a success state with data', () => {
      const data = { id: 1, name: 'test' };
      const result = successState(data);

      expect(result).toEqual({
        status: 'success',
        data,
      });
    });

    it('should handle different data types', () => {
      expect(successState(42)).toEqual({ status: 'success', data: 42 });
      expect(successState(null)).toEqual({ status: 'success', data: null });
      expect(successState(undefined)).toEqual({ status: 'success', data: undefined });
    });
  });

  describe('errorState', () => {
    it('should create an error state with error', () => {
      const error = new Error('Test error');
      const result = errorState(error);

      expect(result).toEqual({
        status: 'error',
        error,
      });
    });

    it('should handle different error types', () => {
      expect(errorState('string error')).toEqual({ status: 'error', error: 'string error' });
      expect(errorState({ code: 500 })).toEqual({ status: 'error', error: { code: 500 } });
      expect(errorState(null)).toEqual({ status: 'error', error: null });
    });
  });

  describe('type safety', () => {
    it('should maintain type information', () => {
      const idle: DataState<string> = idleState<string>();
      const loading: DataState<number> = loadingState<number>(42);
      const success: DataState<{ name: string }> = successState({ name: 'test' });
      const error: DataState<Error> = errorState(new Error('test'));

      expect(idle.status).toBe('idle');
      expect(loading.status).toBe('loading');
      expect(success.status).toBe('success');
      expect(error.status).toBe('error');
    });
  });
});
