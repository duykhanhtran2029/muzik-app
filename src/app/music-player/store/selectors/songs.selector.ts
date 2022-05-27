
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SongsState } from '../reducers/songs.reducer';


export const SongFeatureSelector = createFeatureSelector<SongsState>('songs');

export const getAllSongs = createSelector(
    SongFeatureSelector,
    state => state.songs
);

export const getFingerPrintingResult = createSelector(
    SongFeatureSelector,
    state => state.fingerPrintingResult
);
