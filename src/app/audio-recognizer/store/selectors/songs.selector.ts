
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { selectAll, SongsState } from '../reducers/songs.reducer';


export const SongFeatureSelector = createFeatureSelector<SongsState>('songs');

export const getAllSongs = createSelector(
    SongFeatureSelector,
    selectAll
);

export const areSongsLoaded = createSelector(
    SongFeatureSelector,
    state => state.songsLoaded
);

export const getFingerPrintingResult = createSelector(
    SongFeatureSelector,
    state => state.fingerPrintingResult
);