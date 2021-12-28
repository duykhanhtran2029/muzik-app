import { User } from 'src/app/interfaces/user.interface';
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Audio Recognizer API] Login',
  props<{ account: string }>()
);

export const loginSuccess = createAction(
  '[Audio Recognizer API] Logged In',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Audio Recognizer API] Loggin failure',
  props<{ error: string }>()
);
