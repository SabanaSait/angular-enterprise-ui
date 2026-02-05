import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render default heading and description', () => {
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h3');
    const description = fixture.nativeElement.querySelector('p');

    expect(heading.textContent.trim()).toBe('No data available');
    expect(description.textContent.trim()).toBe('');
  });
  it('should render custom heading and description', () => {
    fixture.componentRef.setInput('heading', 'No users');
    fixture.componentRef.setInput('description', 'Create a user to get started');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('No users');
    expect(fixture.nativeElement.querySelector('p').textContent).toContain(
      'Create a user to get started',
    );
  });
  it('should not render action button when actionLabel is empty', () => {
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeNull();
  });
  it('should render action button when actionLabel is provided', () => {
    fixture.componentRef.setInput('actionLabel', 'Add user');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button).not.toBeNull();
    expect(button.textContent.trim()).toBe('Add user');
  });
  it('should emit action event when button is clicked', () => {
    const emitSpy = vi.spyOn(component.action, 'emit');

    fixture.componentRef.setInput('actionLabel', 'Retry');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(emitSpy).toHaveBeenCalled();
  });
  it('should have proper aria attributes', () => {
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');

    expect(section.getAttribute('role')).toBe('status');
    expect(section.getAttribute('aria-live')).toBe('polite');
  });
});
