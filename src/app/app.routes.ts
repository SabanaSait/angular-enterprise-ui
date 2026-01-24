import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/auth/auth.guard';
import { permissionGuard } from './core/auth/permission.guard';

// App root level routes
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./features/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
  {
    path: 'loading',
    loadComponent: () =>
      import('./shared/components/loading/loading.component').then((m) => m.LoadingComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canMatch: [authGuard],
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'users',
        canMatch: [permissionGuard('VIEW_USERS')],
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES),
      },
      {
        path: 'admin',
        canMatch: [permissionGuard('MANAGE_USERS')],
        loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
