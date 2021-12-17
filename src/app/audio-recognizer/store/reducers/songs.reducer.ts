import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Song } from 'src/app/interfaces/song.interface';
import * as actions from '../actions/songs.actions';

export interface SongsState extends EntityState<Song> {
    songsLoaded: boolean;
}

export const adapter: EntityAdapter<Song> = createEntityAdapter<Song>();

export const initialState = adapter.getInitialState({
    songsLoaded: false
});

export const songReducer = createReducer(
    initialState,
    on(actions.getSongsSuccess, (state, action) => {
        return adapter.addMany(
            action.songs,
            { ...state, songsLoaded: true }
        );
    }),
    on(
        actions.getSongsFailure,
         (state, action) => ({
            ...state,
            error: action.error
        })
    ),
    on(
        actions.getSongSuccess,
        (state, action) => ({
            ...state,
            songs: action.song
        })
    ),
    on(
        actions.getSongFailure,
        (state, action) => ({
            ...state,
            error: action.error
        })
    ),
    on(
        actions.fingerPrintingSuccess,
        (state, action) => ({
            ...state,
            songs: action.song
        })
    ),
    on(
        actions.fingerPrintingFailure,
        (state, action) => ({
            ...state,
            error: action.error
        })
    )
);

export const { selectAll, selectIds } = adapter.getSelectors();