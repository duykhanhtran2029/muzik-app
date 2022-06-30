
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CoreState } from '../state/core.state';


export const SongFeatureSelector = createFeatureSelector<CoreState>('core');

export const getAllSongs = createSelector(
    SongFeatureSelector,
    state => state.songs
);

export const getFingerPrintingResult = createSelector(
    SongFeatureSelector,
    state => state.fingerPrintingResult
);

export const getIsAdmin = createSelector(
    SongFeatureSelector,
    state => state.isAdmin
);

export const getUserId = createSelector(
    SongFeatureSelector,
    state => state.userId
);

export const getIsAuthenticated = createSelector(
    SongFeatureSelector,
    state => state.isAuthenticated
);
