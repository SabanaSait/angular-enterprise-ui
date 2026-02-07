import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pipe, PipeTransform } from '@angular/core';

import { PermissionsTableComponent } from './permissions-table.component';
import { AdminPermission } from '../../models/permission.model';
import { PermissionLabelPipe } from '../../../../shared/pipes/permission-label.pipe';

@Pipe({
  name: 'permissionLabel',
  standalone: true,
})
class PermissionLabelStubPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('PermissionsTableComponent', () => {
  let component: PermissionsTableComponent;
  let fixture: ComponentFixture<PermissionsTableComponent>;
  const render = () => fixture.detectChanges(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsTableComponent, PermissionLabelStubPipe],
    })
      .overrideComponent(PermissionsTableComponent, {
        remove: { imports: [PermissionLabelPipe] },
        add: { imports: [PermissionLabelStubPipe] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PermissionsTableComponent);
    component = fixture.componentInstance;
    render();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept permissions input', () => {
    component.permissions = [
      { id: '1', code: 'VIEW_ADMIN', description: 'View admin' },
      { id: '2', code: 'VIEW_USERS', description: 'View users' },
    ] as AdminPermission[];
    render();

    expect(component.permissions.length).toBe(2);
  });
});
