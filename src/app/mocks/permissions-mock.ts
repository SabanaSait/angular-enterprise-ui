import { AdminPermission } from '../features/admin/models/permission.model';

export const MOCK_PERMISSIONS: AdminPermission[] = [
  {
    id: crypto.randomUUID(),
    code: 'VIEW_DASHBOARD',
    label: 'Allows access to the application dashboard and high-level metrics.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_USERS',
    label: 'Allows viewing the users list and user details in read-only mode.',
  },
  {
    id: crypto.randomUUID(),
    code: 'MANAGE_USERS',
    label: 'Allows creating, editing, and deleting users.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_ADMIN',
    label: 'Allows access to the Admin module.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_ROLES',
    label: 'Allows viewing roles and their assigned permissions in read-only mode.',
  },
  {
    id: crypto.randomUUID(),
    code: 'MANAGE_ROLES',
    label: 'Allows creating, editing, and deleting roles and assigning permissions to them.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_PERMISSIONS',
    label: 'Allows viewing the permissions catalog in read-only mode.',
  },
  {
    id: crypto.randomUUID(),
    code: 'MANAGE_PERMISSIONS',
    label: 'Allows creating, editing, and deleting permissions.',
  },
];
