import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { RolesApi } from './roles.api';
import { ApiService } from '../../../core/api/api.service';
import { AdminRole } from '../models/role.model';

describe('RolesApi', () => {
  let api: RolesApi;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    post: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [RolesApi, { provide: ApiService, useValue: apiServiceMock }],
    });

    api = TestBed.inject(RolesApi);
  });

  it('should request roles with retry options', () => {
    const roles: AdminRole[] = [];
    apiServiceMock.get.mockReturnValue(of(roles));

    api.getRoles().subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/api/admin/roles', {
      interceptorOptions: { retry: true },
    });
  });

  it('should request role by id with retry options', () => {
    const role: AdminRole = {
      id: '1',
      code: 'ADMIN',
      name: 'Admin',
      permissions: [],
      system: true,
    };
    apiServiceMock.get.mockReturnValue(of(role));

    api.getRole('1').subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/api/admin/roles/1', {
      interceptorOptions: { retry: true },
    });
  });

  it('should create role', () => {
    apiServiceMock.post.mockReturnValue(of({}));
    const payload = { name: 'New role' };

    api.createRole(payload).subscribe();

    expect(apiServiceMock.post).toHaveBeenCalledWith('/api/admin/roles', payload);
  });

  it('should update role', () => {
    apiServiceMock.put.mockReturnValue(of({}));
    const payload = { name: 'Updated role' };

    api.updateRole('1', payload).subscribe();

    expect(apiServiceMock.put).toHaveBeenCalledWith('/api/admin/roles/1', payload);
  });

  it('should delete role', () => {
    api.deleteRole('1');

    expect(apiServiceMock.delete).toHaveBeenCalledWith('/api/admin/roles/1');
  });
});
