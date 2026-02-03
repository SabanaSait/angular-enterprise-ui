import { HttpContextToken } from '@angular/common/http';

export const IS_FINAL_ERROR = new HttpContextToken<boolean>(() => true);
