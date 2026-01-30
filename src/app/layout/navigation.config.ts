import { Permission } from '../core/auth/auth.types';

export interface NavItem {
  label: string;
  route: string;
  permission?: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
  },
  {
    label: 'Users',
    route: '/users',
    permission: 'VIEW_USERS',
  },
  {
    label: 'Admin',
    route: '/admin',
    permission: 'VIEW_ADMIN',
  },
];
