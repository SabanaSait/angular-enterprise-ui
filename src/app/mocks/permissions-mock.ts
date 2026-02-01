import { AdminPermission } from '../features/admin/models/permission.model';

export const MOCK_PERMISSIONS: AdminPermission[] = [
  {
    id: crypto.randomUUID(),
    code: 'VIEW_DASHBOARD',
    description: 'Allows access to the application dashboard and high-level metrics.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_USERS',
    description: 'Allows viewing the users list and user details in read-only mode.',
  },
  {
    id: crypto.randomUUID(),
    code: 'MANAGE_USERS',
    description: 'Allows creating, editing, and deleting users.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_ADMIN',
    description: 'Allows access to the Admin module.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_ROLES',
    description: 'Allows viewing roles and their assigned permissions in read-only mode.',
  },
  {
    id: crypto.randomUUID(),
    code: 'MANAGE_ROLES',
    description: 'Allows creating, editing, and deleting roles and assigning permissions to them.',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_PERMISSIONS',
    description: 'Allows viewing the permissions catalog in read-only mode.',
  },
  {
    id: crypto.randomUUID(),
    code: 'MANAGE_PERMISSIONS',
    description: 'Allows creating, editing, and deleting permissions.',
  },
];
