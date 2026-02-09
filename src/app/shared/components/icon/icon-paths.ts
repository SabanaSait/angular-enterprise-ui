export type IconName = 'edit' | 'delete' | 'visibility' | 'check';

export const ICON_PATHS: Record<IconName, string> = {
  edit: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  delete: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  visibility:
    'M12 4.5C7 4.5 2.73 7.61 1 11c1.73 3.39 6 6.5 11 6.5s9.27-3.11 11-6.5C21.27 7.61 17 4.5 12 4.5zm0 10a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z',
  check: 'M9 16.2l-3.5-3.5-1.4 1.4L9 19 20.3 7.7l-1.4-1.4z',
};
