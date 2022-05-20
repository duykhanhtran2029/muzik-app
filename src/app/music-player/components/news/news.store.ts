import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

export interface SongState {
  songs: Song[];
  getNewestSongsStatus: ApiRequestStatus;
}
export const initialState: SongState = {
  songs: [],
  getNewestSongsStatus: undefined,
};
@Injectable()
export class NewsStore extends ComponentStore<SongState> {
  //#region ***Selectors***
  readonly songs$: Observable<Song[]> = this.select((state) => state.songs);
  readonly getNewestSongsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getNewestSongsStatus
  );
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***
  readonly updateSongs = this.updater((state, songs: Song[]) => ({
    ...state,
    songs,
  }));

  readonly updateGetNewestSongsStatus = this.updater(
    (state, getNewestSongsStatus: ApiRequestStatus) => ({
      ...state,
      getNewestSongsStatus,
    })
  );
  //#endregion

  //#region ***Effects***
  readonly getSongsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetNewestSongsStatus(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.service.getNewestSongs().pipe(
          tapResponse(
            (songs) => {
              this.updateSongs(songs);
              this.updateGetNewestSongsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetNewestSongsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  //#endregion

  constructor(private service: MusicPlayerSongService) {
    super(initialState);
  }
}
