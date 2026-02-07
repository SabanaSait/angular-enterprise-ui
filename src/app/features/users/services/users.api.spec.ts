import { TestBed } from '@angular/core/testing';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { UsersApi } from './users.api';
import { ApiService } from '../../../core/api/api.service';
import { NotificationService } from '../../../core/notification/notification.service';
import { PaginatedResponse } from '../../../core/api/api.model';
import { User, UserStatus } from '../models/user.model';

describe('UsersApi', () => {
  let api: UsersApi;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
  let notificationMock: { success: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    notificationMock = {
      success: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        UsersApi,
        { provide: ApiService, useValue: apiServiceMock },
        { provide: NotificationService, useValue: notificationMock },
      ],
    });

    api = TestBed.inject(UsersApi);
  });

  it('should request users with query params and retry options', () => {
    const response: PaginatedResponse<User> = {
      entities: [],
      total: 0,
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'name',
      sortDirection: 'asc',
    };
    apiServiceMock.get.mockReturnValue(of(response));

    api
      .getUsers({ pageNumber: 2, pageSize: 25, sortBy: 'email', sortDirection: 'desc' })
      .subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledTimes(1);
    const [url, options] = apiServiceMock.get.mock.calls[0];
    expect(url).toBe('/api/users');
    expect(options.interceptorOptions).toEqual({ retry: true, retryCount: 3 });

    const params = options.params as HttpParams;
    expect(params.get('pageNumber')).toBe('2');
    expect(params.get('pageSize')).toBe('25');
    expect(params.get('sortBy')).toBe('email');
    expect(params.get('sortDir')).toBe('desc');
  });

  it('should request user by id with retry options', () => {
    const user: User = {
      id: '1',
      name: 'Ada',
      email: 'ada@test.com',
      role: 'ADMIN',
      status: UserStatus.Active,
    };
    apiServiceMock.get.mockReturnValue(of(user));

    api.getUser('1').subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/api/users/1', {
      interceptorOptions: { retry: true, retryCount: 3 },
    });
  });

  it('should create user and send success notification', () => {
    apiServiceMock.post.mockReturnValue(of({}));

    api
      .createUser({
        name: 'New User',
        email: 'new@test.com',
        role: 'USER',
        status: UserStatus.Active,
      })
      .subscribe();

    expect(apiServiceMock.post).toHaveBeenCalledWith('/api/users', {
      name: 'New User',
      email: 'new@test.com',
      role: 'USER',
      status: UserStatus.Active,
    });
    expect(notificationMock.success).toHaveBeenCalledWith('User created successfully!');
  });

  it('should update user and send success notification', () => {
    apiServiceMock.put.mockReturnValue(of({}));

    api
      .updateUser({
        id: '2',
        name: 'Updated User',
        email: 'updated@test.com',
        role: 'ADMIN',
        status: UserStatus.Inactive,
      })
      .subscribe();

    expect(apiServiceMock.put).toHaveBeenCalledWith('/api/users', {
      id: '2',
      name: 'Updated User',
      email: 'updated@test.com',
      role: 'ADMIN',
      status: UserStatus.Inactive,
    });
    expect(notificationMock.success).toHaveBeenCalledWith('User updated successfully!');
  });

  it('should delete user and send success notification', () => {
    apiServiceMock.delete.mockReturnValue(of({}));

    api.deleteUser('3').subscribe();

    expect(apiServiceMock.delete).toHaveBeenCalledWith('/api/users/3');
    expect(notificationMock.success).toHaveBeenCalledWith('User deleted successfully!');
  });
});
