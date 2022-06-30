import { Action, createReducer, on } from '@ngrx/store';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import * as actions from '../actions/core.actions';
import { CoreState } from '../state/core.state';

export const initialState = <CoreState>{};

export const coreReducer = createReducer(
  initialState,
  on(actions.getSongs, (state, action) => ({
    ...state,
    getSongStatus: ApiRequestStatus.Requesting,
  })),

  on(actions.getSongsSuccess, (state, action) => ({
    ...state,
    songs: action.songs,
    getSongStatus: ApiRequestStatus.Success,
  })),

  on(actions.getSongsFailure, (state, action) => ({
    ...state,
    error: action.error,
    getSongStatus: ApiRequestStatus.Fail,
  })),

  on(actions.fingerPrinting, (state, action) => ({
    ...state,
    fingerPrintingStatus: ApiRequestStatus.Requesting,
  })),

  on(actions.fingerPrintingSuccess, (state, action) => ({
    ...state,
    fingerPrintingResult: action.fingerPrintingResult,
    fingerPrintingStatus: ApiRequestStatus.Success,
  })),

  on(actions.fingerPrintingFailure, (state, action) => ({
    ...state,
    error: action.error,
    fingerPrintingStatus: ApiRequestStatus.Fail,
  })),

  on(actions.setIsAdmin, (state, action) => ({
    ...state,
    isAdmin: action.isAdmin
  })),

  on(actions.setUserId, (state, action) => ({
    ...state,
    userId: action.userId
  }))
);
