import { TestBed } from '@angular/core/testing';
import { vi, type Mock } from 'vitest';
import { NotificationService } from './notification.service';
import { ToastMessageVariant } from '../toast/toast.types';

describe('NotificationService', () => {
  let service: NotificationService;
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
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with empty messages array', () => {
      expect(service.messages()).toEqual([]);
    });
  });

  describe('success', () => {
    it('should add success message', () => {
      const mockId = 'mock-uuid-success';
      randomUUIDMock.mockReturnValue(mockId);

      service.success('Operation completed successfully');

      expect(service.messages()).toEqual([
        {
          id: mockId,
          message: 'Operation completed successfully',
          variant: 'success',
          autoClose: true,
        },
      ]);
      expect(randomUUIDMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('info', () => {
    it('should add info message', () => {
      const mockId = 'mock-uuid-info';
      randomUUIDMock.mockReturnValue(mockId);

      service.info('Here is some information');

      expect(service.messages()).toEqual([
        {
          id: mockId,
          message: 'Here is some information',
          variant: 'info',
          autoClose: true,
        },
      ]);
      expect(randomUUIDMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('warning', () => {
    it('should add warning message', () => {
      const mockId = 'mock-uuid-warning';
      randomUUIDMock.mockReturnValue(mockId);

      service.warning('This is a warning');

      expect(service.messages()).toEqual([
        {
          id: mockId,
          message: 'This is a warning',
          variant: 'warning',
          autoClose: true,
        },
      ]);
      expect(randomUUIDMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('show', () => {
    it('should add message with default info variant', () => {
      const mockId = 'mock-uuid-default';
      randomUUIDMock.mockReturnValue(mockId);

      service.show('Default message');

      expect(service.messages()).toEqual([
        {
          id: mockId,
          message: 'Default message',
          variant: 'info',
          autoClose: true,
        },
      ]);
    });

    it('should add message with specified variant', () => {
      const mockId = 'mock-uuid-custom';
      randomUUIDMock.mockReturnValue(mockId);

      service.show('Custom message', 'success');

      expect(service.messages()).toEqual([
        {
          id: mockId,
          message: 'Custom message',
          variant: 'success',
          autoClose: true,
        },
      ]);
    });

    it('should add multiple messages with unique IDs', () => {
      const mockId1 = 'mock-uuid-1';
      const mockId2 = 'mock-uuid-2';
      const mockId3 = 'mock-uuid-3';
      randomUUIDMock
        .mockReturnValueOnce(mockId1)
        .mockReturnValueOnce(mockId2)
        .mockReturnValueOnce(mockId3);

      service.success('Success message');
      service.info('Info message');
      service.warning('Warning message');

      expect(service.messages()).toEqual([
        {
          id: mockId1,
          message: 'Success message',
          variant: 'success',
          autoClose: true,
        },
        {
          id: mockId2,
          message: 'Info message',
          variant: 'info',
          autoClose: true,
        },
        {
          id: mockId3,
          message: 'Warning message',
          variant: 'warning',
          autoClose: true,
        },
      ]);
      expect(randomUUIDMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('removeMessage', () => {
    it('should remove message by ID', () => {
      const mockId1 = 'mock-uuid-1';
      const mockId2 = 'mock-uuid-2';
      randomUUIDMock.mockReturnValueOnce(mockId1).mockReturnValueOnce(mockId2);

      service.success('First message');
      service.info('Second message');

      expect(service.messages()).toHaveLength(2);

      service.removeMessage(mockId1);

      expect(service.messages()).toEqual([
        {
          id: mockId2,
          message: 'Second message',
          variant: 'info',
          autoClose: true,
        },
      ]);
    });

    it('should do nothing when removing non-existent ID', () => {
      const mockId = 'mock-uuid-1';
      randomUUIDMock.mockReturnValue(mockId);

      service.success('Test message');

      expect(service.messages()).toHaveLength(1);

      service.removeMessage('non-existent-id');

      expect(service.messages()).toHaveLength(1);
      expect(service.messages()[0].id).toBe(mockId);
    });

    it('should handle removing from empty list', () => {
      expect(service.messages()).toEqual([]);

      service.removeMessage('any-id');

      expect(service.messages()).toEqual([]);
    });

    it('should remove correct message when multiple exist', () => {
      const mockIds = ['id-1', 'id-2', 'id-3'];
      randomUUIDMock
        .mockReturnValueOnce(mockIds[0])
        .mockReturnValueOnce(mockIds[1])
        .mockReturnValueOnce(mockIds[2]);

      service.success('Message 1');
      service.info('Message 2');
      service.warning('Message 3');

      service.removeMessage(mockIds[1]); // Remove middle message

      expect(service.messages()).toEqual([
        {
          id: mockIds[0],
          message: 'Message 1',
          variant: 'success',
          autoClose: true,
        },
        {
          id: mockIds[2],
          message: 'Message 3',
          variant: 'warning',
          autoClose: true,
        },
      ]);
    });
  });

  describe('message properties', () => {
    it('should always set autoClose to true', () => {
      const mockId = 'mock-uuid-autoclose';
      randomUUIDMock.mockReturnValue(mockId);

      service.show('Test message', 'error');

      expect(service.messages()[0].autoClose).toBe(true);
    });

    it('should handle empty message strings', () => {
      const mockId = 'mock-uuid-empty';
      randomUUIDMock.mockReturnValue(mockId);

      service.show('', 'info');

      expect(service.messages()).toEqual([
        {
          id: mockId,
          message: '',
          variant: 'info',
          autoClose: true,
        },
      ]);
    });

    it('should handle long message strings', () => {
      const mockId = 'mock-uuid-long';
      const longMessage = 'A'.repeat(1000);
      randomUUIDMock.mockReturnValue(mockId);

      service.show(longMessage, 'warning');

      expect(service.messages()[0].message).toBe(longMessage);
      expect(service.messages()[0].message.length).toBe(1000);
    });
  });

  describe('signal reactivity', () => {
    it('should provide readonly signal', () => {
      expect(service.messages).toBeDefined();
      expect(typeof service.messages).toBe('function');
    });

    it('should update signal when messages are added', () => {
      const mockId = 'mock-uuid-reactive-add';
      randomUUIDMock.mockReturnValue(mockId);

      expect(service.messages()).toEqual([]);

      service.success('New message');

      expect(service.messages()).toHaveLength(1);
      expect(service.messages()[0].id).toBe(mockId);
    });

    it('should update signal when messages are removed', () => {
      const mockId = 'mock-uuid-reactive-remove';
      randomUUIDMock.mockReturnValue(mockId);

      service.info('Message to remove');

      expect(service.messages()).toHaveLength(1);

      service.removeMessage(mockId);

      expect(service.messages()).toEqual([]);
    });

    it('should maintain message order', () => {
      const mockIds = ['first', 'second', 'third'];
      randomUUIDMock
        .mockReturnValueOnce(mockIds[0])
        .mockReturnValueOnce(mockIds[1])
        .mockReturnValueOnce(mockIds[2]);

      service.success('First');
      service.info('Second');
      service.warning('Third');

      const messages = service.messages();
      expect(messages[0].message).toBe('First');
      expect(messages[1].message).toBe('Second');
      expect(messages[2].message).toBe('Third');
    });
  });

  describe('variant handling', () => {
    it('should accept all valid ToastMessageVariant values', () => {
      const variants: ToastMessageVariant[] = ['success', 'info', 'warning', 'error'];
      const mockIds = variants.map((_, i) => `mock-id-${i}`);

      variants.forEach((variant, index) => {
        randomUUIDMock.mockReturnValueOnce(mockIds[index]);
        service.show(`Message ${index}`, variant);
      });

      const messages = service.messages();
      variants.forEach((variant, index) => {
        expect(messages[index].variant).toBe(variant);
      });
    });
  });
});
