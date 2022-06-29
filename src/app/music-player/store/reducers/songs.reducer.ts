import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import * as actions from '../actions/songs.actions';

export interface SongsState extends EntityState<Song> {
  songs: Song[];
  fingerPrintingResult: FingerPrintingResult;
  getSongsStatus: ApiRequestStatus;
  fingerPrintingStatus: ApiRequestStatus;
  isAdmin: boolean;
}

export const initialState = <SongsState>{};

export const songReducer = createReducer(
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
);
