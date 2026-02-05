import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the label text', () => {
    fixture.componentRef.setInput('label', 'Active');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge.textContent.trim()).toBe('Active');
  });
  it('should apply the variant class', () => {
    fixture.componentRef.setInput('label', 'Info');
    fixture.componentRef.setInput('variant', 'info');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge.classList).toContain('badge-info');
  });
  it('should apply custom class when provided', () => {
    fixture.componentRef.setInput('label', 'Custom');
    fixture.componentRef.setInput('customClass', 'my-custom-class');
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.badge');
    expect(badge.classList).toContain('my-custom-class');
  });
});
