import { createAction, props } from '@ngrx/store';
import { Song } from 'src/app/interfaces/song.interface';

export const getSongs = createAction(
    '[Audio Recognizer API] Get songs'
);

export const getSongsSuccess = createAction(
    '[Audio Recognizer API] Get songs success',
    props<{ songs: Song[] }>()
);

export const getSongsFailure = createAction(
    '[Audio Recognizer API] Get songs failure',
    props<{ error: string }>()
);

export const getSong = createAction(
    '[Audio Recognizer API] Get song'
);

export const getSongSuccess = createAction(
    '[Audio Recognizer API] Get song success',
    props<{ song: Song }>()
);

export const getSongFailure = createAction(
    '[Audio Recognizer API] Get song failure',
    props<{ error: string }>()
);

export const fingerPrinting = createAction(
    '[Audio Recognizer API] Fingerprinting',
    props<{ formData: FormData }>()
);

export const fingerPrintingSuccess = createAction(
    '[Audio Recognizer API] Get Fingerprinting success',
    props<{ song: Song }>()
);

export const fingerPrintingFailure = createAction(
    '[Audio Recognizer API] Get Fingerprinting failure',
    props<{ error: string }>()
);