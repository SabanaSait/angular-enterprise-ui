import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

import { PermissionsFacade } from './permissions.facade';
import { PermissionsApi } from '../services/permissions.api';
import { AdminPermission } from '../models/permission.model';

describe('PermissionsFacade', () => {
  let facade: PermissionsFacade;
  let permissionsApiMock: {
    getPermissions: ReturnType<typeof vi.fn>;
  };

  const permission: AdminPermission = {
    id: 'perm-1',
    code: 'VIEW_ADMIN',
    description: 'View admin area',
  };

  const waitForSignal = () => new Promise((resolve) => setTimeout(resolve, 10));

  beforeEach(() => {
    permissionsApiMock = {
      getPermissions: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [PermissionsFacade, { provide: PermissionsApi, useValue: permissionsApiMock }],
    });

    facade = TestBed.inject(PermissionsFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should start in loading state', () => {
    const permissionsSubject = new Subject<AdminPermission[]>();
    permissionsApiMock.getPermissions.mockReturnValue(permissionsSubject.asObservable());

    const permissionsState = TestBed.runInInjectionContext(() => facade.permissionsState);
    const state = permissionsState();
    expect(state.status).toBe('loading');
  });

  it('should emit success state when permissions load', async () => {
    const permissionsSubject = new Subject<AdminPermission[]>();
    permissionsApiMock.getPermissions.mockReturnValue(permissionsSubject.asObservable());

    const permissionsState = TestBed.runInInjectionContext(() => facade.permissionsState);
    expect(permissionsState().status).toBe('loading');

    await waitForSignal();
    permissionsSubject.next([permission]);
    await waitForSignal();

    expect(permissionsState().status).toBe('success');
    expect(permissionsState().data).toEqual([permission]);
  });

  it('should emit error state when api fails', async () => {
    const permissionsSubject = new Subject<AdminPermission[]>();
    permissionsApiMock.getPermissions.mockReturnValue(permissionsSubject.asObservable());

    const permissionsState = TestBed.runInInjectionContext(() => facade.permissionsState);
    expect(permissionsState().status).toBe('loading');

    permissionsSubject.error(new Error('API failed'));
    await waitForSignal();

    expect(permissionsState().status).toBe('error');
    expect(permissionsState().error).toBeTruthy();
  });

  it('should expose permissions from the data state', async () => {
    const permissionsSubject = new Subject<AdminPermission[]>();
    permissionsApiMock.getPermissions.mockReturnValue(permissionsSubject.asObservable());

    const permissionsState = TestBed.runInInjectionContext(() => facade.permissionsState);
    TestBed.runInInjectionContext(() => facade.permissions());

    await waitForSignal();
    permissionsSubject.next([permission]);
    await waitForSignal();

    expect(permissionsState().status).toBe('success');
    expect(TestBed.runInInjectionContext(() => facade.permissions())).toEqual([permission]);
  });

  it('should refetch permissions when refresh is called', async () => {
    const firstSubject = new Subject<AdminPermission[]>();
    const secondSubject = new Subject<AdminPermission[]>();
    permissionsApiMock.getPermissions
      .mockReturnValueOnce(firstSubject.asObservable())
      .mockReturnValueOnce(secondSubject.asObservable());

    const permissionsState = TestBed.runInInjectionContext(() => facade.permissionsState);
    permissionsState();
    await waitForSignal();

    expect(permissionsApiMock.getPermissions).toHaveBeenCalledTimes(1);

    facade.refresh();
    await waitForSignal();

    expect(permissionsApiMock.getPermissions).toHaveBeenCalledTimes(2);
  });
});
