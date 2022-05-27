import { Update } from '@ngrx/entity';
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

export const cleanState = createAction('[Audio Recognizer API] Clean state');
