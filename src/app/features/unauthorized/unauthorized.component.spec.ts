import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

import { UnauthorizedComponent } from './unauthorized.component';

/* --------------------------------------------
 * Stub ErrorStateComponent
 * ------------------------------------------ */
@Component({
  selector: 'app-error-state',
  standalone: true,
  template: `<button data-testid="action-btn" (click)="action.emit()">action</button>`,
})
class ErrorStateStubComponent {
  @Input() statusCode?: number;
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}

describe('UnauthorizedComponent', () => {
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let component: UnauthorizedComponent;

  let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    routerMock = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UnauthorizedComponent, ErrorStateStubComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    })
      .overrideComponent(UnauthorizedComponent, {
        remove: { imports: [ErrorStateComponent] },
        add: { imports: [ErrorStateStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /* --------------------------------------------
   * Basics
   * ------------------------------------------ */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* --------------------------------------------
   * Template wiring
   * ------------------------------------------ */

  it('should render error state component', () => {
    const errorState = fixture.nativeElement.querySelector('app-error-state');
    expect(errorState).toBeTruthy();
  });

  it('should pass 403 status code to error state', () => {
    const errorState = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ErrorStateStubComponent,
    );

    expect(errorState.componentInstance.statusCode).toBe(403);
  });

  it('should pass action label to error state', () => {
    const errorState = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ErrorStateStubComponent,
    );

    expect(errorState.componentInstance.actionLabel).toBe('Go back to Dashboard');
  });

  /* --------------------------------------------
   * Behavior
   * ------------------------------------------ */

  it('should navigate to dashboard when action is triggered', () => {
    const errorState = fixture.debugElement.query(
      (el) => el.componentInstance instanceof ErrorStateStubComponent,
    );

    errorState.componentInstance.action.emit();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should navigate to dashboard when goBack is called', () => {
    component.goBack();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('should call goBack when action button is clicked', () => {
    const spy = vi.spyOn(component, 'goBack');

    const button = fixture.nativeElement.querySelector('[data-testid="action-btn"]');
    button.click();

    expect(spy).toHaveBeenCalled();
  });
});
