import { createAction, props } from '@ngrx/store';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';

export const getSongs = createAction('[Music Player API] Get songs');

export const getSongsSuccess = createAction(
  '[Music Player API] Get songs success',
  props<{ songs: Song[] }>()
);

export const getSongsFailure = createAction(
  '[Music Player API] Get songs failure',
  props<{ error: string }>()
);

export const getRecommendSongs = createAction(
  '[Music Recommend API] Get songs',
  props<{ userId: string }>()
  );

export const getRecommendSongsSuccess = createAction(
  '[Music Recommend API] Get songs success',
  props<{ recommendSongs: Song[] }>()
);

export const getRecommendSongsFailure = createAction(
  '[Music Recommend API] Get songs failure',
  props<{ error: string }>()
);

export const fingerPrinting = createAction(
  '[Audio Recognizer API] Fingerprinting',
  props<{ fileName: string }>()
);

export const fingerPrintingSuccess = createAction(
  '[Audio Recognizer API] Get Fingerprinting success',
  props<{ fingerPrintingResult: FingerPrintingResult }>()
);

export const fingerPrintingFailure = createAction(
  '[Audio Recognizer API] Get Fingerprinting failure',
  props<{ error: string }>()
);

export const setIsAdmin = createAction(
  '[Auth0] Set IsAdmin',
  props<{ isAdmin: boolean }>()
);

export const setUserId = createAction(
  '[Auth0] Set UserId',
  props<{ userId: string }>()
);

export const setIsAuthenticated = createAction(
  '[Auth0] Set IsAuthenticated',
  props<{ isAuthenticated: boolean }>()
);

export const setToken = createAction(
  '[Auth0] Set Token',
  props<{ token: string }>()
);

export const logIn = createAction(
'[Auth0] Login',
  props<{ payload: string }>()
);
export const logOut = createAction('[Auth0] Logout');