export interface Environment {
  production: boolean;
  USE_MOCK_API: boolean;
  API_BASE_URL: string;
  COPILOT_URL?: string;
  COPILOT_ORIGIN?: string;
}
