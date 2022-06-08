import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

export interface ResultState {
    songs: Song[];
    getSongsStatus: ApiRequestStatus;
}
export const initialState: ResultState = {
    songs: [],
    getSongsStatus: undefined,
};
@Injectable()
export class ResultStore extends ComponentStore<ResultState> {
    //#region ***Selectors***
    readonly songs$: Observable<Song[]> = this.select((state) => state.songs);
    readonly getSongsStatus$: Observable<ApiRequestStatus> = this.select(
        (state) => state.getSongsStatus
    );

    //#region ***Updaters (Reducers in @ngrx/store term)***
    readonly updateSongs = this.updater((state, songs: Song[]) => ({
        ...state,
        songs,
    }));

    readonly updateGetSongsStatus = this.updater(
        (state, getSongsStatus: ApiRequestStatus) => ({
            ...state,
            getSongsStatus,
        })
    );
    //#endregion

    //#region ***Effects***
    readonly getSongsEffect = this.effect((songIds$: Observable<string[]>) =>
    songIds$.pipe(
            tap(() => this.updateGetSongsStatus(ApiRequestStatus.Requesting)),
            switchMap((songIds: string[]) =>
                this.songService.getSongs(songIds).pipe(
                    tapResponse(
                        (songs) => {
                            this.updateSongs(songs);
                            this.updateGetSongsStatus(ApiRequestStatus.Success);
                        },
                        (err) => {
                            this.updateGetSongsStatus(ApiRequestStatus.Fail);
                        }
                    )
                )
            )
        )
    );

    //#endregion

    constructor(
        private songService: MusicPlayerSongService
    ) {
        super(initialState);
    }
}
