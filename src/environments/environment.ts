import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  USE_MOCK_API: false,
  API_BASE_URL: '/api',
  COPILOT_URL: 'http://localhost:3001/embed',
  COPILOT_ORIGIN: 'http://localhost:3001',
};
