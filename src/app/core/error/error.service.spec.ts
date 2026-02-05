import { TestBed } from '@angular/core/testing';
import { vi, type Mock } from 'vitest';
import { ErrorService } from './error.service';
import { HTTP_ERROR_MESSAGES } from './error.constants';
import { ApiError } from '../api/api.model';

describe('ErrorService', () => {
  let service: ErrorService;
  let randomUUIDMock: Mock;

  beforeEach(() => {
    // Mock crypto.randomUUID
    randomUUIDMock = vi.fn();
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        randomUUID: randomUUIDMock,
      },
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [ErrorService],
    });
    service = TestBed.inject(ErrorService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty errors array', () => {
      expect(service.errors()).toEqual([]);
    });
  });

  describe('pushError', () => {
    it('should add error with 401 status', () => {
      const mockId = 'mock-uuid-401';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 401, message: 'Unauthorized' };

      service.pushError(error);

      expect(service.errors()).toEqual([
        {
          id: mockId,
          message: HTTP_ERROR_MESSAGES[401].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
      expect(randomUUIDMock).toHaveBeenCalledTimes(1);
    });

    it('should add error with 403 status', () => {
      const mockId = 'mock-uuid-403';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 403, message: 'Forbidden' };

      service.pushError(error);

      expect(service.errors()).toEqual([
        {
          id: mockId,
          message: HTTP_ERROR_MESSAGES[403].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
    });

    it('should add error with 404 status', () => {
      const mockId = 'mock-uuid-404';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 404, message: 'Not Found' };

      service.pushError(error);

      expect(service.errors()).toEqual([
        {
          id: mockId,
          message: HTTP_ERROR_MESSAGES[404].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
    });

    it('should add error with 500 status', () => {
      const mockId = 'mock-uuid-500';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 500, message: 'Internal Server Error' };

      service.pushError(error);

      expect(service.errors()).toEqual([
        {
          id: mockId,
          message: HTTP_ERROR_MESSAGES[500].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
    });

    it('should add error with unknown status (fallback to 500)', () => {
      const mockId = 'mock-uuid-unknown';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 418, message: "I'm a teapot" };

      service.pushError(error);

      // Should fallback to 500 for unknown status codes
      expect(service.errors()).toEqual([
        {
          id: mockId,
          message: HTTP_ERROR_MESSAGES[500].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
    });

    it('should add error with network error status (0)', () => {
      const mockId = 'mock-uuid-network';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 0, message: 'Network Error' };

      service.pushError(error);

      expect(service.errors()).toEqual([
        {
          id: mockId,
          message: HTTP_ERROR_MESSAGES[0].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
    });

    it('should add multiple errors with unique IDs', () => {
      const mockId1 = 'mock-uuid-1';
      const mockId2 = 'mock-uuid-2';
      randomUUIDMock.mockReturnValueOnce(mockId1).mockReturnValueOnce(mockId2);

      const error1: ApiError = { status: 401, message: 'Unauthorized' };
      const error2: ApiError = { status: 404, message: 'Not Found' };

      service.pushError(error1);
      service.pushError(error2);

      expect(service.errors()).toEqual([
        {
          id: mockId1,
          message: HTTP_ERROR_MESSAGES[401].title,
          variant: 'error',
          autoClose: false,
        },
        {
          id: mockId2,
          message: HTTP_ERROR_MESSAGES[404].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
      expect(randomUUIDMock).toHaveBeenCalledTimes(2);
    });

    it('should handle error with additional properties', () => {
      const mockId = 'mock-uuid-full';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = {
        status: 500,
        message: 'Server Error',
        code: 'INTERNAL_ERROR',
        details: { field: 'email' },
        original: new Error('Original error'),
      };

      service.pushError(error);

      // Only status is used for message mapping, other properties are ignored
      expect(service.errors()).toEqual([
        {
          id: mockId,
          message: HTTP_ERROR_MESSAGES[500].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
    });
  });

  describe('removeError', () => {
    it('should remove error by ID', () => {
      const mockId1 = 'mock-uuid-1';
      const mockId2 = 'mock-uuid-2';
      randomUUIDMock.mockReturnValueOnce(mockId1).mockReturnValueOnce(mockId2);

      const error1: ApiError = { status: 401, message: 'Unauthorized' };
      const error2: ApiError = { status: 404, message: 'Not Found' };

      service.pushError(error1);
      service.pushError(error2);

      expect(service.errors()).toHaveLength(2);

      service.removeError(mockId1);

      expect(service.errors()).toEqual([
        {
          id: mockId2,
          message: HTTP_ERROR_MESSAGES[404].title,
          variant: 'error',
          autoClose: false,
        },
      ]);
    });

    it('should do nothing when removing non-existent ID', () => {
      const mockId = 'mock-uuid-1';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 401, message: 'Unauthorized' };
      service.pushError(error);

      expect(service.errors()).toHaveLength(1);

      service.removeError('non-existent-id');

      expect(service.errors()).toHaveLength(1);
      expect(service.errors()[0].id).toBe(mockId);
    });

    it('should handle removing from empty list', () => {
      expect(service.errors()).toEqual([]);

      service.removeError('any-id');

      expect(service.errors()).toEqual([]);
    });
  });

  describe('error message mapping', () => {
    it('should map all defined HTTP status codes correctly', () => {
      const testCases = [
        { status: 401, expectedTitle: 'Session expired' },
        { status: 403, expectedTitle: 'Access denied' },
        { status: 404, expectedTitle: 'Not found' },
        { status: 500, expectedTitle: 'Something went wrong' },
        { status: 503, expectedTitle: 'Service unavailable' },
        { status: 0, expectedTitle: 'Unknown error occured' },
      ];

      testCases.forEach(({ status, expectedTitle }) => {
        const mockId = `mock-uuid-${status}`;
        randomUUIDMock.mockReturnValue(mockId);

        const error: ApiError = { status, message: 'Test' };
        service.pushError(error);

        expect(service.errors()[0].message).toBe(expectedTitle);
        expect(service.errors()[0].id).toBe(mockId);

        // Clear for next test
        service.removeError(mockId);
      });
    });
  });

  describe('signal reactivity', () => {
    it('should provide readonly signal', () => {
      expect(service.errors).toBeDefined();
      expect(typeof service.errors).toBe('function');
    });

    it('should update signal when errors are added', () => {
      const mockId = 'mock-uuid-reactive';
      randomUUIDMock.mockReturnValue(mockId);

      expect(service.errors()).toEqual([]);

      const error: ApiError = { status: 500, message: 'Server Error' };
      service.pushError(error);

      expect(service.errors()).toHaveLength(1);
      expect(service.errors()[0].id).toBe(mockId);
    });

    it('should update signal when errors are removed', () => {
      const mockId = 'mock-uuid-remove';
      randomUUIDMock.mockReturnValue(mockId);

      const error: ApiError = { status: 404, message: 'Not Found' };
      service.pushError(error);

      expect(service.errors()).toHaveLength(1);

      service.removeError(mockId);

      expect(service.errors()).toEqual([]);
    });
  });
});
