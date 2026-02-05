import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatCardComponent } from './stat-card.component';

describe('StatCardComponent', () => {
  let component: StatCardComponent;
  let fixture: ComponentFixture<StatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render the label', () => {
    fixture.componentRef.setInput('label', 'Total Users');
    fixture.componentRef.setInput('value', 42);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.lable');
    expect(label.textContent.trim()).toBe('Total Users');
  });
  it('should render numeric value', () => {
    fixture.componentRef.setInput('label', 'Users');
    fixture.componentRef.setInput('value', 123);
    fixture.detectChanges();

    const value = fixture.nativeElement.querySelector('.value');
    expect(value.textContent.trim()).toBe('123');
  });
  it('should render string value', () => {
    fixture.componentRef.setInput('label', 'Status');
    fixture.componentRef.setInput('value', 'Active');
    fixture.detectChanges();

    const value = fixture.nativeElement.querySelector('.value');
    expect(value.textContent.trim()).toBe('Active');
  });
});
