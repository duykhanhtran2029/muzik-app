import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';

export interface PlaylistState {
  playlists: Playlist[];
  getTrendingPlaylistsStatus: ApiRequestStatus;
  createPlaylistsStatus: ApiRequestStatus;
}
export const initialState: PlaylistState = {
  playlists: [],
  getTrendingPlaylistsStatus: undefined,
  createPlaylistsStatus: undefined,
};
@Injectable()
export class PlaylistsStore extends ComponentStore<PlaylistState> {
  //#region ***Selectors***
  readonly playlists$: Observable<Playlist[]> = this.select(
    (state) => state.playlists
  );

  readonly getTrendingPlaylistsStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.getTrendingPlaylistsStatus);

  readonly createPlaylistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.createPlaylistsStatus
  );
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***

  readonly updatePlaylists = this.updater((state, playlists: Playlist[]) => ({
    ...state,
    playlists,
  }));

  readonly updateGetTrendingPlaylistsStatus = this.updater(
    (state, getTrendingPlaylistsStatus: ApiRequestStatus) => ({
      ...state,
      getTrendingPlaylistsStatus,
    })
  );

  readonly updateCreatePlaylistsStatus = this.updater(
    (state, createPlaylistsStatus: ApiRequestStatus) => ({
      ...state,
      createPlaylistsStatus,
    })
  );
  //#endregion

  //#region ***Effects***
  readonly getPlaylistsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() =>
        this.updateGetTrendingPlaylistsStatus(ApiRequestStatus.Requesting)
      ),
      switchMap(() =>
        this.playlistService
          .getPlaylistsByUserId('google-oauth2|114795482044392002727')
          .pipe(
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

  readonly createPlaylistsEffect = this.effect(
    (playlist$: Observable<Playlist>) =>
      playlist$.pipe(
        tap(() =>
          this.updateCreatePlaylistsStatus(ApiRequestStatus.Requesting)
        ),
        switchMap((playlist) =>
          this.playlistService.createPlaylist(playlist).pipe(
            tapResponse(
              () => {
                this.updateCreatePlaylistsStatus(ApiRequestStatus.Success);
              },
              (err) => {
                this.updateCreatePlaylistsStatus(ApiRequestStatus.Fail);
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
