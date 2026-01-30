import { Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';
import { PermissionsPageComponent } from './pages/permissions-page/permissions-page.component';
import { permissionGuard } from '../../core/auth/permission.guard';
import { RoleDetailsComponent } from './pages/role-details/role-details.component';
import { AdminIndexComponent } from './pages/admin-index/admin-index.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: '',
        component: AdminIndexComponent,
        children: [
          {
            path: 'roles',
            canMatch: [permissionGuard('VIEW_ROLES')],
            component: RolesPageComponent,
          },
          {
            path: 'permissions',
            canMatch: [permissionGuard('VIEW_PERMISSIONS')],
            component: PermissionsPageComponent,
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'roles',
          },
        ],
      },
      {
        path: 'roles/:role',
        canMatch: [permissionGuard('VIEW_ROLES')],
        component: RoleDetailsComponent,
      },
    ],
  },
];
