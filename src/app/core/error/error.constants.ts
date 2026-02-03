export interface ErrorMessages {
  title: string;
  description: string;
  actionLabel?: string;
}

export const HTTP_ERROR_MESSAGES: Record<number, ErrorMessages> = {
  401: {
    title: 'Session expired',
    description: 'Please sign in again to continue.',
    actionLabel: 'Login',
  },
  403: {
    title: 'Access denied',
    description: 'You do not have permission to view this page.',
  },
  404: {
    title: 'Not found',
    description: 'The requested resource does not exist or may have been removed.',
    actionLabel: 'Go back',
  },
  500: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later.',
  },
  503: {
    title: 'Service unavailable',
    description: 'The service is temporarily unavailable. Please try again later.',
  },
  0: {
    title: 'Unknown error occured',
    description: 'Network error. Please check your internet connection.',
  },
};
