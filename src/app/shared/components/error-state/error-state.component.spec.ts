import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HTTP_ERROR_MESSAGES } from '../../../core/error/error.constants';
import { ErrorStateComponent } from './error-state.component';

describe('ErrorStateComponent', () => {
  let component: ErrorStateComponent;
  let fixture: ComponentFixture<ErrorStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render default error when no inputs are provided', () => {
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2');
    const description = fixture.nativeElement.querySelector('p');

    expect(title.textContent.trim()).toBe('Something went wrong');
    expect(description.textContent).toContain('An unexpected error occurred');
  });

  it('should prefer explicit errorTitle and errorDescription', () => {
    fixture.componentRef.setInput('errorTitle', 'Access denied');
    fixture.componentRef.setInput('errorDescription', 'You do not have permission');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Access denied');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain(
      'You do not have permission',
    );
  });

  it('should render title without description when only errorTitle is provided', () => {
    fixture.componentRef.setInput('errorTitle', 'Oops');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2');
    const description = fixture.nativeElement.querySelector('p');

    expect(title.textContent.trim()).toBe('Oops');
    expect(description).toBeNull();
  });

  it('should resolve error from statusCode when no explicit inputs are provided', () => {
    fixture.componentRef.setInput('statusCode', 403);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h2');
    const description = fixture.nativeElement.querySelector('p');

    expect(title.textContent).toContain(HTTP_ERROR_MESSAGES[403].title);
    expect(description.textContent).toContain(HTTP_ERROR_MESSAGES[403].description);
  });

  it('should render action button and emit action on click', () => {
    const emitSpy = vi.spyOn(component.action, 'emit');

    fixture.componentRef.setInput('actionLabel', 'Retry');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button).not.toBeNull();

    button.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should have assertive aria attributes', () => {
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('role')).toBe('alert');
    expect(section.getAttribute('aria-live')).toBe('assertive');
  });
});
