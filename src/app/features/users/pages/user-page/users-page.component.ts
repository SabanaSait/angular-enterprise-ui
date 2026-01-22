import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SortDirection, UserSortKey } from '../../models/users-query.model';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { UsersFacade } from '../../facade/users.facade';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  imports: [UsersTableComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private readonly facade = inject(UsersFacade);
  private readonly router = inject(Router);
  protected readonly userState = this.facade.usersState;
  protected readonly loading = this.facade.loading;
  protected readonly query = this.facade.query;
  constructor() {}

  public setPageNumber(pageNumber: number): void {
    this.facade.setPage(pageNumber);
  }

  public setSort(sort: { by: UserSortKey; direction: SortDirection }): void {
    this.facade.setSort(sort.by, sort.direction);
  }

  public onAddUser(): void {
    this.router.navigate(['users/create']);
  }

  public onEditUser(user: User): void {
    this.router.navigate(['users', user.id, 'edit']);
  }

  public onDeleteUser(user: User): void {
    this.facade.deleteUser(user.id);
  }
}
