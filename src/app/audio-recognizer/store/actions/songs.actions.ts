import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';

export const getSongs = createAction('[Audio Recognizer API] Get songs');

export const getSongsSuccess = createAction(
  '[Audio Recognizer API] Get songs success',
  props<{ songs: Song[] }>()
);

export const getSongsFailure = createAction(
  '[Audio Recognizer API] Get songs failure',
  props<{ error: string }>()
);

export const getSong = createAction('[Audio Recognizer API] Get song');

export const getSongSuccess = createAction(
  '[Audio Recognizer API] Get song success',
  props<{ song: Song }>()
);

export const getSongFailure = createAction(
  '[Audio Recognizer API] Get song failure',
  props<{ error: string }>()
);

export const deleteSong = createAction(
  '[Audio Recognizer API] Delete song',
  props<{ songId: number }>()
);

export const deleteSongSuccess = createAction(
  '[Audio Recognizer API] Delete song success',
  props<{ song: Song }>()
);

export const deleteSongFailure = createAction(
  '[Audio Recognizer API] Delete song failure',
  props<{ error: string }>()
);

export const updateSong = createAction(
  '[Audio Recognizer API] Update song',
  props<{ song: Song }>()
);

export const updateSongSuccess = createAction(
  '[Audio Recognizer API] Update song success',
  props<{ song: Song }>()
);

export const updateSongFailure = createAction(
  '[Audio Recognizer API] Update song failure',
  props<{ error: string }>()
);

export const createSong = createAction(
  '[Audio Recognizer API] Create song',
  props<{ song: Song }>()
);

export const createSongSuccess = createAction(
  '[Audio Recognizer API] Create song success',
  props<{ song: Song }>()
);

export const createSongFailure = createAction(
  '[Audio Recognizer API] Create song failure',
  props<{ error: string }>()
);

export const fingerPrinting = createAction(
  '[Audio Recognizer API] Fingerprinting',
  props<{ formData: FormData }>()
);

export const fingerPrintingSuccess = createAction(
  '[Audio Recognizer API] Get Fingerprinting success',
  props<{ fingerPrintingResult: FingerPrintingResult }>()
);

export const fingerPrintingFailure = createAction(
  '[Audio Recognizer API] Get Fingerprinting failure',
  props<{ error: string }>()
);

export const processRecording = createAction(
  '[Audio Recognizer API] Processing Recording',
  props<{ fileName: string }>()
);

export const processRecordingSuccess = createAction(
  '[Audio Recognizer API] Processing Recording Success',
  props<{ fingerPrintingResult: FingerPrintingResult }>()
);

export const processRecordingFailure = createAction(
  '[Audio Recognizer API] Processing Recording Failure',
  props<{ error: string }>()
);

export const cleanState = createAction('[Audio Recognizer API] Clean state');
