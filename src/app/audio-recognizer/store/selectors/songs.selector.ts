
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

export const getUpdateSongStatus = createSelector(
    SongFeatureSelector,
    state => state.updateSongStatus 
);


export const getCreateSongStatus = createSelector(
    SongFeatureSelector,
    state => state.createSongStatus
);