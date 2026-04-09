import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  USE_MOCK_API: false, // Never use mocks in production
  API_BASE_URL: '/api',
};
