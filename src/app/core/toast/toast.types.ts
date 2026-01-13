export type ToastMessageVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastMessageVariant;
  autoClose?: boolean;
}
