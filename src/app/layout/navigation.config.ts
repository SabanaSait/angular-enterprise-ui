import { Permission } from '../core/auth/auth.types';

export interface NavItem {
  label: string;
  route: string;
  permission?: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: $localize`:@@nav.dashboard:Dashboard`,
    route: '/dashboard',
  },
  {
    label: $localize`:@@nav.users:Users`,
    route: '/users',
    permission: 'VIEW_USERS',
  },
  {
    label: $localize`:@@nav.admin:Admin`,
    route: '/admin',
    permission: 'VIEW_ADMIN',
  },
];
