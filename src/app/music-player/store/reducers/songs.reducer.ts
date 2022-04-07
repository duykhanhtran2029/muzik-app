import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import * as actions from '../actions/songs.actions';

export interface SongsState extends EntityState<Song> {
  songs: Song[];
  song: Song;
  fingerPrintingResult: FingerPrintingResult;
  getSongsStatus: ApiRequestStatus;
  createSongStatus: ApiRequestStatus;
  updateSongStatus: ApiRequestStatus;
  deleteSongStatus: ApiRequestStatus;
  fingerPrintingStatus: ApiRequestStatus;
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

  on(actions.createSong, (state) => ({
    ...state,
    createSongStatus: ApiRequestStatus.Requesting,
  })),

  on(actions.createSongSuccess, (state, action) => {
    let tmpSongs = [...state.songs];
    tmpSongs.push(action.song);
    return {
      ...state,
      songs: tmpSongs,
      createSongStatus: ApiRequestStatus.Success,
    };
  }),

  on(actions.createSongFailure, (state, action) => ({
    ...state,
    error: action.error,
    createSongStatus: ApiRequestStatus.Fail,
  })),

  on(actions.updateSong, (state) => ({
    ...state,
    updateSongStatus: ApiRequestStatus.Requesting,
  })),

  on(actions.updateSongSuccess, (state, action) => {
    const index = state.songs.findIndex((s) => s.id === action.song.id);
    let tmpSongs = [...state.songs];
    tmpSongs[index] = action.song;
    return {
      ...state,
      songs: tmpSongs,
      updateSongStatus: ApiRequestStatus.Success,
    };
  }),

  on(actions.updateSongFailure, (state, action) => ({
    ...state,
    error: action.error,
    updateSongStatus: ApiRequestStatus.Fail,
  })),

  on(actions.deleteSong, (state) => ({
    ...state,
    deleteSongStatus: ApiRequestStatus.Requesting,
  })),

  on(actions.deleteSongSuccess, (state, action) => {
    return {
      ...state,
      songs: state.songs.filter((s) => s.id !== action.song.id),
      deleteSongStatus: ApiRequestStatus.Success,
    };
  }),

  on(actions.deleteSongFailure, (state, action) => ({
    ...state,
    error: action.error,
    deleteSongStatus: ApiRequestStatus.Fail,
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


  on(actions.cleanState, (state) => ({
    ...state,
    getSongsStatus: undefined,
    createSongStatus: undefined,
    updateSongStatus: undefined,
    deleteSongStatus: undefined,
    fingerPrintingStatus: undefined,
  }))
);
