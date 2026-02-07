import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { PermissionsApi } from './permissions.api';
import { ApiService } from '../../../core/api/api.service';
import { AdminPermission } from '../models/permission.model';

describe('PermissionsApi', () => {
  let api: PermissionsApi;
  let apiServiceMock: {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    apiServiceMock = {
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [PermissionsApi, { provide: ApiService, useValue: apiServiceMock }],
    });

    api = TestBed.inject(PermissionsApi);
  });

  it('should request permissions with retry options', () => {
    const permissions: AdminPermission[] = [];
    apiServiceMock.get.mockReturnValue(of(permissions));

    api.getPermissions().subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/api/admin/permissions', {
      interceptorOptions: { retry: true },
    });
  });

  it('should request permission by id', () => {
    const permission: AdminPermission = {
      id: '1',
      code: 'VIEW_ADMIN',
      description: 'View admin',
    };
    apiServiceMock.get.mockReturnValue(of(permission));

    api.getPermission('1').subscribe();

    expect(apiServiceMock.get).toHaveBeenCalledWith('/api/admin/permissions/1');
  });

  it('should create permission', () => {
    apiServiceMock.put.mockReturnValue(of({}));
    const payload = { code: 'VIEW_ADMIN' as const };

    api.createPermission(payload).subscribe();

    expect(apiServiceMock.put).toHaveBeenCalledWith('/api/admin/permissions', payload);
  });

  it('should update permission', () => {
    apiServiceMock.put.mockReturnValue(of({}));
    const payload = { description: 'Updated' };

    api.updatePermission('1', payload).subscribe();

    expect(apiServiceMock.put).toHaveBeenCalledWith('/api/admin/permissions/1', payload);
  });

  it('should delete permission', () => {
    apiServiceMock.delete.mockReturnValue(of({}));

    api.deletePermission('1').subscribe();

    expect(apiServiceMock.delete).toHaveBeenCalledWith('/api/admin/permissions/1');
  });
});
