import { environment } from '../../environments/environment';
import { HttpInterceptorFn } from '@angular/common/http';
import { usersMockInterceptor } from './users-mock.interceptor';
import { rolesMockInterceptor } from './roles-mock.interceptor';
import { permissionsMockInterceptor } from './permissions-mock.interceptor';

export const MOCK_INTERCEPTORS: HttpInterceptorFn[] = [
  usersMockInterceptor,
  rolesMockInterceptor,
  permissionsMockInterceptor,
];

export function getMockInterceptors() {
  const runtimeToggle =
    typeof localStorage !== 'undefined' && localStorage.getItem('USE_MOCK_API') === 'true';

  if (environment.USE_MOCK_API || runtimeToggle) {
    console.log('Mock API Enabled');
    return MOCK_INTERCEPTORS;
  }

  console.log('Mock API Disabled');
  return [];
}
