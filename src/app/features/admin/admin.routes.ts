import { Routes } from '@angular/router';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { RolesPageComponent } from './pages/roles-page/roles-page.component';
import { PermissionsPageComponent } from './pages/permissions-page/permissions-page.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminPageComponent,
    children: [
      {
        path: 'roles',
        component: RolesPageComponent,
      },
      {
        path: 'permissions',
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
