import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { User } from 'src/app/interfaces/user.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import * as actions from '../actions/user.actions';

export interface UserState extends EntityState<User> {
  user: User;
  loggedIn: boolean;
  isLoading: boolean;
  errorMessage: string;
  hasError: boolean;
}

export const initialState = <UserState>{};

export const userReducer = createReducer(
  initialState,
  on(actions.login, (state, action) => ({
    ...state,
    hasError: false,
    isLoading: true,
    errorMessage: null,
  })),

  on(actions.loginSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isLoading: false,
    loggedIn: true,
  })),

  on(actions.loginFailure, (state, action) => ({
    ...state,
    error: action.error,
    hasError: true,
    isLoading: false,
  }))
);
