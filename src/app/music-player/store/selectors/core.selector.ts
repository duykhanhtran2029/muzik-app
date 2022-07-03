
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { CoreState } from '../state/core.state';


export const CoreFeatureSelector = createFeatureSelector<CoreState>('core');

export const getAllSongs = createSelector(
    CoreFeatureSelector,
    state => state.songs
);

export const getFingerPrintingResult = createSelector(
    CoreFeatureSelector,
    state => state.fingerPrintingResult
);

export const getIsAdmin = createSelector(
    CoreFeatureSelector,
    state => state.isAdmin
);

export const getUserId = createSelector(
    CoreFeatureSelector,
    state => state.userId
);

export const getIsAuthenticated = createSelector(
    CoreFeatureSelector,
    state => state.isAuthenticated
);

export const getToken = createSelector(
    CoreFeatureSelector,
    state => state.token
);
