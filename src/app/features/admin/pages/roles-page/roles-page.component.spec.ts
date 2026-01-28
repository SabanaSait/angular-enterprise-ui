import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesPageComponent } from './roles-page.component';

describe('RolesPageComponent', () => {
  let component: RolesPageComponent;
  let fixture: ComponentFixture<RolesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolesPageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
