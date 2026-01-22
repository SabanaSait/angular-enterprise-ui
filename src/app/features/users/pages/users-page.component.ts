import { Component, inject } from '@angular/core';
import { SortDirection, UserSortKey } from '../models/users-query.model';
import { UsersTableComponent } from '../components/users-table/users-table.component';
import { UsersFacade } from '../facade/users.facade';

@Component({
  selector: 'app-users',
  imports: [UsersTableComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private readonly facade = inject(UsersFacade);
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
}
