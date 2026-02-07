import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { UsersFacade } from './users.facade';
import { UsersApi } from '../services/users.api';
import { PaginatedResponse } from '../../../core/api/api.model';
import { User, UserStatus } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';

describe('UsersFacade', () => {
  let facade: UsersFacade;
  let usersApiMock: {
    getUsers: ReturnType<typeof vi.fn>;
    getUser: ReturnType<typeof vi.fn>;
    createUser: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };

  const user: User = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    role: 'USER',
    status: UserStatus.Active,
  };

  const response: PaginatedResponse<User> = {
    entities: [user],
    total: 1,
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortDirection: 'asc',
  };

  const waitForSignal = () => new Promise((resolve) => setTimeout(resolve, 10));

  beforeEach(() => {
    usersApiMock = {
      getUsers: vi.fn(),
      getUser: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
      deleteUser: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [UsersFacade, { provide: UsersApi, useValue: usersApiMock }],
    });

    facade = TestBed.inject(UsersFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should expose default query values', () => {
    expect(facade.query()).toEqual({
      pageNumber: 1,
      pageSize: 20,
      sortBy: 'name',
      sortDirection: 'asc',
    });
  });

  it('should call getUsers with default query on refresh', async () => {
    usersApiMock.getUsers.mockReturnValue(of(response));

    const usersState = TestBed.runInInjectionContext(() => facade.usersState);
    usersState();
    await waitForSignal();

    facade.refresh();
    await waitForSignal();

    expect(usersApiMock.getUsers).toHaveBeenCalledWith({
      pageNumber: 1,
      pageSize: 20,
      sortBy: 'name',
      sortDirection: 'asc',
    });
  });

  it('should update page number and request users', async () => {
    usersApiMock.getUsers.mockReturnValue(of(response));

    const usersState = TestBed.runInInjectionContext(() => facade.usersState);
    usersState();
    await waitForSignal();

    facade.setPage(3);
    await waitForSignal();

    expect(facade.query().pageNumber).toBe(3);
    expect(usersApiMock.getUsers).toHaveBeenCalledWith({
      pageNumber: 3,
      pageSize: 20,
      sortBy: 'name',
      sortDirection: 'asc',
    });
  });

  it('should update sort and reset page number', async () => {
    usersApiMock.getUsers.mockReturnValue(of(response));

    const usersState = TestBed.runInInjectionContext(() => facade.usersState);
    usersState();
    await waitForSignal();

    facade.setPage(4);
    await waitForSignal();

    facade.setSort('email', 'desc');
    await waitForSignal();

    expect(facade.query()).toMatchObject({
      pageNumber: 1,
      sortBy: 'email',
      sortDirection: 'desc',
    });
    expect(usersApiMock.getUsers).toHaveBeenLastCalledWith({
      pageNumber: 1,
      pageSize: 20,
      sortBy: 'email',
      sortDirection: 'desc',
    });
  });

  it('should forward getUser calls to the api', () => {
    const apiResult$ = of(user);
    usersApiMock.getUser.mockReturnValue(apiResult$);

    const result$ = facade.getUser('user-1');

    expect(result$).toBe(apiResult$);
    expect(usersApiMock.getUser).toHaveBeenCalledWith('user-1');
  });

  it('should refresh after creating a user', () => {
    const payload: CreateUserDto = {
      name: 'New User',
      email: 'new@example.com',
      role: 'ADMIN',
      status: UserStatus.Active,
    };
    usersApiMock.createUser.mockReturnValue(of({}));
    const refreshSpy = vi.spyOn(facade, 'refresh');

    facade.createUser(payload);

    expect(usersApiMock.createUser).toHaveBeenCalledWith(payload);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('should refresh after updating a user', () => {
    const payload: UpdateUserDto = {
      id: 'user-2',
      name: 'Updated User',
      email: 'updated@example.com',
      role: 'SUPERVISOR',
      status: UserStatus.Inactive,
    };
    usersApiMock.updateUser.mockReturnValue(of({}));
    const refreshSpy = vi.spyOn(facade, 'refresh');

    facade.updateUser(payload);

    expect(usersApiMock.updateUser).toHaveBeenCalledWith(payload);
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });

  it('should refresh after deleting a user', () => {
    usersApiMock.deleteUser.mockReturnValue(of({}));
    const refreshSpy = vi.spyOn(facade, 'refresh');

    facade.deleteUser('user-3');

    expect(usersApiMock.deleteUser).toHaveBeenCalledWith('user-3');
    expect(refreshSpy).toHaveBeenCalledTimes(1);
  });
});
