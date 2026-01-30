import { Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';
import { PermissionsPageComponent } from './pages/permissions-page/permissions-page.component';
import { permissionGuard } from '../../core/auth/permission.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
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
];
