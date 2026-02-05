import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingStateComponent } from './loading-state.component';

describe('LoadingStateComponent', () => {
  let component: LoadingStateComponent;
  let fixture: ComponentFixture<LoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingStateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingStateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render default loading text', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.querySelector('div');
    expect(text.textContent.trim()).toBe('Loading...');
  });
  it('should render custom loading text', () => {
    fixture.componentRef.setInput('loadingText', 'Fetching users...');
    fixture.detectChanges();

    const text = fixture.nativeElement.querySelector('div');
    expect(text.textContent.trim()).toBe('Fetching users...');
  });
  it('should have proper loading aria attributes', () => {
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('section');
    expect(section.getAttribute('aria-busy')).toBe('true');
    expect(section.getAttribute('aria-live')).toBe('polite');
  });
});
