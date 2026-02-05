import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { signal } from '@angular/core';
import { ToastContainerComponent } from './toast-container.component';
import { ErrorService } from '../error/error.service';
import { NotificationService } from '../notification/notification.service';
import { ToastMessage } from './toast.types';

describe('ToastContainerComponent', () => {
  let component: ToastContainerComponent;
  let fixture: ComponentFixture<ToastContainerComponent>;
  let errorServiceMock: any;
  let notificationServiceMock: any;

  const mockError: ToastMessage = {
    id: 'error-1',
    message: 'Test error',
    variant: 'error',
    autoClose: true,
  };

  const mockNotification: ToastMessage = {
    id: 'notification-1',
    message: 'Test notification',
    variant: 'success',
    autoClose: false,
  };

  beforeEach(async () => {
    errorServiceMock = {
      removeError: vi.fn(),
      errors: signal([mockError]),
    };

    notificationServiceMock = {
      removeMessage: vi.fn(),
      messages: signal([mockNotification]),
    };

    await TestBed.configureTestingModule({
      imports: [ToastContainerComponent],
      providers: [
        { provide: ErrorService, useValue: errorServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastContainerComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should combine messages from error and notification services', () => {
    const allMessages = component.allMessages();
    expect(allMessages).toEqual([mockError, mockNotification]);
  });

  it('should display all messages in template', () => {
    fixture.detectChanges();
    const toastElements = fixture.nativeElement.querySelectorAll('app-toast');
    expect(toastElements.length).toBe(2);
  });

  it('should call removeError when removing error toast', () => {
    component.remove(mockError);
    expect(errorServiceMock.removeError).toHaveBeenCalledWith(mockError.id);
    expect(notificationServiceMock.removeMessage).not.toHaveBeenCalled();
  });

  it('should call removeMessage when removing notification toast', () => {
    component.remove(mockNotification);
    expect(notificationServiceMock.removeMessage).toHaveBeenCalledWith(mockNotification.id);
    expect(errorServiceMock.removeError).not.toHaveBeenCalled();
  });

  it('should handle empty messages from both services', () => {
    errorServiceMock.errors = signal([]);
    notificationServiceMock.messages = signal([]);

    const allMessages = component.allMessages();
    expect(allMessages).toEqual([]);
  });

  it('should handle messages from only error service', () => {
    notificationServiceMock.messages = signal([]);

    const allMessages = component.allMessages();
    expect(allMessages).toEqual([mockError]);
  });

  it('should handle messages from only notification service', () => {
    errorServiceMock.errors = signal([]);

    const allMessages = component.allMessages();
    expect(allMessages).toEqual([mockNotification]);
  });

  it('should have proper ARIA attributes', () => {
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.toast-container');
    expect(container.getAttribute('aria-live')).toBe('polite');
    expect(container.getAttribute('aria-atomic')).toBe('false');
  });
});
