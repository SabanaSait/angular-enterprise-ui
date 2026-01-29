import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsTableComponent } from './permissions-table.component';

describe('PermissionsTableComponent', () => {
  let component: PermissionsTableComponent;
  let fixture: ComponentFixture<PermissionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionsTableComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
