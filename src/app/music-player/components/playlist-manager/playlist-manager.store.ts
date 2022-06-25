import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';

export interface PlaylistState {
  playlists: Playlist[];
  getTrendingPlaylistsStatus: ApiRequestStatus;
}
export const initialState: PlaylistState = {
  playlists: [],
  getTrendingPlaylistsStatus: undefined,
};
@Injectable()
export class PlaylistsStore extends ComponentStore<PlaylistState> {
  //#region ***Selectors***
  readonly playlists$: Observable<Playlist[]> = this.select(
    (state) => state.playlists
  );
  readonly getTrendingPlaylistsStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.getTrendingPlaylistsStatus);
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***

  readonly updatePlaylists = this.updater((state, playlists: Playlist[]) => ({
    ...state,
		playlists
  }));

  readonly updateGetTrendingPlaylistsStatus = this.updater(
    (state, getTrendingPlaylistsStatus: ApiRequestStatus) => ({
      ...state,
      getTrendingPlaylistsStatus,
    })
  );

  //#endregion

  //#region ***Effects***
  readonly getPlaylistsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetTrendingPlaylistsStatus(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.playlistService.getPlaylistsByUserId(2).pipe(
          tapResponse(
            (playlists) => {
              this.updatePlaylists(playlists);
              this.updateGetTrendingPlaylistsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetTrendingPlaylistsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );
  //#endregion

  constructor(
		private playlistService: MusicPlayerPlaylistService
  ) {
    super(initialState);
  }
}
