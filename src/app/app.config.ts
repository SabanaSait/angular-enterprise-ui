import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/auth/auth.interceptor';
import { apiInterceptor } from './core/api/api.interceptor';
import { retryInterceptor } from './core/api/retry.interceptor';
import { usersMockInterceptor } from './mocks/users-mock.interceptor';
import { rolesMockInterceptor } from './mocks/roles-mock.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const auth = inject(AuthService);
      auth.restoreSession();
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        usersMockInterceptor,
        rolesMockInterceptor,
        retryInterceptor,
        apiInterceptor,
      ]),
    ),
  ],
};
