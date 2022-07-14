import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';

export interface DetailGenreState {
  playlists: Playlist[];
  getRecentlyPlaylistsStatus: ApiRequestStatus;
}
export const initialState: DetailGenreState = {
  playlists: [],
  getRecentlyPlaylistsStatus: undefined,
};
@Injectable()
export class DetailGenreStore extends ComponentStore<DetailGenreState> {
  //#region ***Selectors***
  readonly playlists$: Observable<Playlist[]> = this.select(
    (state) => state.playlists
  );

  readonly getRecentlyPlaylistsStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.getRecentlyPlaylistsStatus);

  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***

  readonly updatePlaylists = this.updater((state, playlists: Playlist[]) => ({
    ...state,
    playlists,
  }));

  readonly updateGetRecentlyPlaylistsStatus = this.updater(
    (state, getRecentlyPlaylistsStatus: ApiRequestStatus) => ({
      ...state,
      getRecentlyPlaylistsStatus,
    })
  );

  //#endregion

  //#region ***Effects***
  readonly getPlaylistsEffect = this.effect((genreID$: Observable<string>) =>
    genreID$.pipe(
      tap(() =>
        this.updateGetRecentlyPlaylistsStatus(ApiRequestStatus.Requesting)
      ),
      switchMap((genreID) =>
        this.playlistService.getGenre(genreID).pipe(
          tapResponse(
            (playlists) => {
              this.updatePlaylists(playlists);
              this.updateGetRecentlyPlaylistsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetRecentlyPlaylistsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  //#endregion

  constructor(private playlistService: MusicPlayerPlaylistService) {
    super(initialState);
  }
}
