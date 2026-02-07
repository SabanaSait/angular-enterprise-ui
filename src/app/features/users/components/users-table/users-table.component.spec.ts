import { Component, EventEmitter, Input, Output, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { UsersTableComponent } from './users-table.component';
import { User, UserStatus } from '../../models/user.model';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';
import { RoleLabelPipe } from '../../../../shared/pipes/role-label.pipe';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: '',
})
class PaginationStubComponent {
  @Input() pageNumber?: number;
  @Input() pageSize?: number;
  @Input() total?: number;
  @Input() disabled?: boolean;
  @Output() pageChange = new EventEmitter<number>();
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<button data-testid="empty-action" (click)="action.emit()">action</button>`,
})
class EmptyStateStubComponent {
  @Input() heading?: string;
  @Input() description?: string;
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}

@Component({
  selector: 'app-badge',
  standalone: true,
  template: '',
})
class BadgeStubComponent {
  @Input() label?: string;
  @Input() variant?: string;
}

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: '',
})
class LoadingStateStubComponent {}

@Pipe({
  name: 'roleLabel',
  standalone: true,
})
class RoleLabelStubPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('UsersTableComponent', () => {
  let component: UsersTableComponent;
  let fixture: ComponentFixture<UsersTableComponent>;
  const render = () => fixture.detectChanges(false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UsersTableComponent,
        PaginationStubComponent,
        EmptyStateStubComponent,
        BadgeStubComponent,
        LoadingStateStubComponent,
        RoleLabelStubPipe,
      ],
    })
      .overrideComponent(UsersTableComponent, {
        remove: {
          imports: [
            PaginationComponent,
            EmptyStateComponent,
            BadgeComponent,
            LoadingStateComponent,
            RoleLabelPipe,
          ],
        },
        add: {
          imports: [
            PaginationStubComponent,
            EmptyStateStubComponent,
            BadgeStubComponent,
            LoadingStateStubComponent,
            RoleLabelStubPipe,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UsersTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render empty state when there are no users', () => {
    component.users = [];
    component.loading = false;
    component.canManageUsers = false;
    render();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table')).toBeFalsy();
  });

  it('should emit addUser when empty state action is triggered', () => {
    const spy = vi.spyOn(component.addUser, 'emit');
    component.users = [];
    component.loading = false;
    component.canManageUsers = true;
    render();

    const button = fixture.nativeElement.querySelector('[data-testid="empty-action"]');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should show loading state when loading and no users', () => {
    component.users = [];
    component.loading = true;
    render();

    expect(fixture.nativeElement.querySelector('app-loading-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeFalsy();
  });

  it('should render a row per user', () => {
    component.users = [
      { id: '1', name: 'Ada', email: 'ada@test.com', role: 'ADMIN', status: UserStatus.Active },
      { id: '2', name: 'Bob', email: 'bob@test.com', role: 'USER', status: UserStatus.Inactive },
    ] as User[];
    component.sortBy = 'name';
    component.sortDirection = 'asc';
    render();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });

  it('should toggle sort direction for same column', () => {
    const spy = vi.spyOn(component.sortChange, 'emit');
    component.users = [
      { id: '1', name: 'Ada', email: 'ada@test.com', role: 'ADMIN', status: UserStatus.Active },
    ] as User[];
    component.sortBy = 'name';
    component.sortDirection = 'asc';
    render();

    const button = fixture.debugElement.query(By.css('th.sort button'));
    button.nativeElement.click();

    expect(spy).toHaveBeenCalledWith({ by: 'name', direction: 'desc' });
  });

  it('should emit sort asc for new column', () => {
    const spy = vi.spyOn(component.sortChange, 'emit');
    component.users = [
      { id: '1', name: 'Ada', email: 'ada@test.com', role: 'ADMIN', status: UserStatus.Active },
    ] as User[];
    component.sortBy = 'email';
    component.sortDirection = 'desc';
    render();

    const button = fixture.debugElement.query(By.css('th.sort button'));
    button.nativeElement.click();

    expect(spy).toHaveBeenCalledWith({ by: 'name', direction: 'asc' });
  });

  it('should emit edit and delete events from action buttons', () => {
    const editSpy = vi.spyOn(component.editUser, 'emit');
    const deleteSpy = vi.spyOn(component.deleteUser, 'emit');
    component.users = [
      { id: '1', name: 'Ada', email: 'ada@test.com', role: 'ADMIN', status: UserStatus.Active },
    ] as User[];
    component.sortBy = 'name';
    component.sortDirection = 'asc';
    component.canManageUsers = true;
    render();

    const buttons = fixture.nativeElement.querySelectorAll('button.btn.btn-ghost');
    buttons[0].click();
    buttons[1].click();

    expect(editSpy).toHaveBeenCalledWith(component.users[0]);
    expect(deleteSpy).toHaveBeenCalledWith(component.users[0]);
  });

  it('should forward pagination events', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');
    component.users = [
      { id: '1', name: 'Ada', email: 'ada@test.com', role: 'ADMIN', status: UserStatus.Active },
    ] as User[];
    component.sortBy = 'name';
    component.sortDirection = 'asc';
    render();

    const pagination = fixture.debugElement.query(
      (el) => el.componentInstance instanceof PaginationStubComponent,
    );
    pagination.componentInstance.pageChange.emit(3);

    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should use success badge for active users', () => {
    component.users = [
      { id: '1', name: 'Ada', email: 'ada@test.com', role: 'ADMIN', status: UserStatus.Active },
    ] as User[];
    component.sortBy = 'name';
    component.sortDirection = 'asc';
    render();

    const badge = fixture.debugElement.query(
      (el) => el.componentInstance instanceof BadgeStubComponent,
    );
    expect(badge.componentInstance.variant).toBe('success');
  });
});
