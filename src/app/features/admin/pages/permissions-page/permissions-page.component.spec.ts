import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsPageComponent } from './permissions-page.component';

describe('PermissionsPageComponent', () => {
  let component: PermissionsPageComponent;
  let fixture: ComponentFixture<PermissionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionsPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
