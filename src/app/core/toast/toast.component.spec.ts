import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { ToastComponent } from './toast.component';
import { ToastMessage } from './toast.types';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  const mockMessage: ToastMessage = {
    id: 'test-1',
    message: 'Test message',
    variant: 'success',
    autoClose: true,
  };

  const mockMessageNoAutoClose: ToastMessage = {
    id: 'test-2',
    message: 'Test message no auto close',
    variant: 'error',
    autoClose: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should create', () => {
    component.message = mockMessage;
    expect(component).toBeTruthy();
  });

  it('should display message text', () => {
    component.message = mockMessage;
    fixture.detectChanges();
    const messageElement = fixture.nativeElement.querySelector('span');
    expect(messageElement.textContent).toBe(mockMessage.message);
  });

  it('should apply correct CSS class based on variant', () => {
    component.message = mockMessage;
    fixture.detectChanges();
    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement.classList.contains('success')).toBeTruthy();
  });

  it('should have correct ARIA role', () => {
    component.message = mockMessage;
    fixture.detectChanges();
    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement.getAttribute('role')).toBe('status');
  });

  it('should emit toastClose when close button is clicked', () => {
    component.message = mockMessage;
    const emitSpy = vi.fn();
    component.toastClose = { emit: emitSpy } as any;

    fixture.detectChanges();
    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should have correct button attributes', () => {
    component.message = mockMessage;
    fixture.detectChanges();
    const closeButton = fixture.nativeElement.querySelector('button');

    expect(closeButton.getAttribute('type')).toBe('button');
    expect(closeButton.getAttribute('aria-label')).toBe('Dismiss notification');
    expect(closeButton.getAttribute('title')).toBe('Close');
  });

  it('should auto-close after 4 seconds when autoClose is true', () => {
    vi.useFakeTimers();
    component.message = mockMessage;
    const emitSpy = vi.fn();
    component.toastClose = { emit: emitSpy } as any;

    component.ngOnInit();
    expect(emitSpy).not.toHaveBeenCalled();

    vi.advanceTimersByTime(4000);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not auto-close when autoClose is false', () => {
    vi.useFakeTimers();
    component.message = mockMessageNoAutoClose;
    const emitSpy = vi.fn();
    component.toastClose = { emit: emitSpy } as any;

    component.ngOnInit();
    vi.advanceTimersByTime(4000);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should not auto-close when autoClose is undefined', () => {
    vi.useFakeTimers();
    const messageWithoutAutoClose: ToastMessage = {
      id: 'test-3',
      message: 'Test message',
      variant: 'info',
    };

    component.message = messageWithoutAutoClose;
    const emitSpy = vi.fn();
    component.toastClose = { emit: emitSpy } as any;

    component.ngOnInit();
    vi.advanceTimersByTime(4000);

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should handle success variant', () => {
    const successMessage: ToastMessage = {
      id: 'test-success',
      message: 'Test success',
      variant: 'success',
      autoClose: true,
    };

    component.message = successMessage;
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement.classList.contains('success')).toBeTruthy();
  });

  it('should handle info variant', () => {
    const infoMessage: ToastMessage = {
      id: 'test-info',
      message: 'Test info',
      variant: 'info',
      autoClose: true,
    };

    component.message = infoMessage;
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement.classList.contains('info')).toBeTruthy();
  });

  it('should handle warning variant', () => {
    const warningMessage: ToastMessage = {
      id: 'test-warning',
      message: 'Test warning',
      variant: 'warning',
      autoClose: true,
    };

    component.message = warningMessage;
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement.classList.contains('warning')).toBeTruthy();
  });

  it('should handle error variant', () => {
    const errorMessage: ToastMessage = {
      id: 'test-error',
      message: 'Test error',
      variant: 'error',
      autoClose: true,
    };

    component.message = errorMessage;
    fixture.detectChanges();

    const toastElement = fixture.nativeElement.querySelector('.toast');
    expect(toastElement.classList.contains('error')).toBeTruthy();
  });
});
