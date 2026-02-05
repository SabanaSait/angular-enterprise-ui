import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserStatus } from '../../../features/users/models/user.model';
import { StatusPillComponent } from './status-pill.component';

describe('StatusPillComponent', () => {
  let component: StatusPillComponent;
  let fixture: ComponentFixture<StatusPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusPillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusPillComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the status text in title case', () => {
    fixture.componentRef.setInput('status', 'active');
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.textContent.trim()).toBe('Active');
  });
  it('should apply active class when status is Active', () => {
    fixture.componentRef.setInput('status', UserStatus.Active);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList).toContain('status-active');
  });
  it('should not apply active class for non-active users', () => {
    fixture.componentRef.setInput('status', UserStatus.Inactive);
    fixture.detectChanges();

    const span = fixture.nativeElement.querySelector('span');
    expect(span.classList).not.toContain('status-active');
  });
  it('isActiveUser should return true only for Active status', () => {
    expect(component.isActiveUser(UserStatus.Active)).toBe(true);
    expect(component.isActiveUser(UserStatus.Inactive)).toBe(false);
  });
});
