import { createSelector, createFeatureSelector } from '@ngrx/store';
import { UserState } from '../reducers/users.reducer';

export const UserFeatureSelector = createFeatureSelector<UserState>('users');

export const getCurrentUser = createSelector(
  UserFeatureSelector,
  (state) => state.user
);

export const getLoggedInStatus = createSelector(
  UserFeatureSelector,
  (state) => state.loggedIn
);

export const getUserErrorMessage = createSelector(
  UserFeatureSelector,
  (state) => state.errorMessage
);

export const getUserHasError = createSelector(
  UserFeatureSelector,
  (state) => state.hasError
);

export const getUserIsLoading = createSelector(
  UserFeatureSelector,
  (state) => state.isLoading
);
