import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';

export interface HomeState {
  recentlyPlaylists: Playlist[];
  getRecentlyPlaylistsStatus: ApiRequestStatus;
  playlists2: Playlist[];
  getPlaylists2Status: ApiRequestStatus;
  playlists3: Playlist[];
  getPlaylists3Status: ApiRequestStatus;
  playlists4: Playlist[];
  getPlaylists4Status: ApiRequestStatus;
}
export const initialState: HomeState = {
  recentlyPlaylists: [],
  getRecentlyPlaylistsStatus: undefined,
  playlists2: [],
  getPlaylists2Status: undefined,
  playlists3: [],
  getPlaylists3Status: undefined,
  playlists4: [],
  getPlaylists4Status: undefined,
};
@Injectable()
export class HomeStore extends ComponentStore<HomeState> {
  //#region ***Selectors***
  readonly playlists$: Observable<Playlist[]> = this.select(
    (state) => state.recentlyPlaylists
  );

  readonly getRecentlyPlaylistsStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.getRecentlyPlaylistsStatus);

  readonly playlists2$: Observable<Playlist[]> = this.select(
    (state) => state.playlists2
  );

  readonly getPlaylists2Status$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getPlaylists2Status
  );

  readonly playlists3$: Observable<Playlist[]> = this.select(
    (state) => state.playlists3
  );

  readonly getPlaylists3Status$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getPlaylists3Status
  );

  readonly playlists4$: Observable<Playlist[]> = this.select(
    (state) => state.playlists4
  );

  readonly getPlaylists4Status$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getPlaylists4Status
  );
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***

  readonly updatePlaylists = this.updater((state, playlists: Playlist[]) => ({
    ...state,
    recentlyPlaylists: playlists,
  }));

  readonly updateGetRecentlyPlaylistsStatus = this.updater(
    (state, getRecentlyPlaylistsStatus: ApiRequestStatus) => ({
      ...state,
      getRecentlyPlaylistsStatus,
    })
  );

  readonly updatePlaylists2 = this.updater((state, playlists: Playlist[]) => ({
    ...state,
    playlists2: playlists,
  }));

  readonly updateGetPlaylists2Status = this.updater(
    (state, getPlaylists2Status: ApiRequestStatus) => ({
      ...state,
      getPlaylists2Status,
    })
  );

  readonly updatePlaylists3 = this.updater((state, playlists: Playlist[]) => ({
    ...state,
    playlists3: playlists,
  }));

  readonly updateGetPlaylists3Status = this.updater(
    (state, getPlaylists3Status: ApiRequestStatus) => ({
      ...state,
      getPlaylists3Status,
    })
  );

  readonly updatePlaylists4 = this.updater((state, playlists: Playlist[]) => ({
    ...state,
    playlists4: playlists,
  }));

  readonly updateGetPlaylists4Status = this.updater(
    (state, getPlaylists4Status: ApiRequestStatus) => ({
      ...state,
      getPlaylists4Status,
    })
  );

  //#endregion

  //#region ***Effects***
  readonly getPlaylistsEffect = this.effect((userID$: Observable<string>) =>
    userID$.pipe(
      tap(() =>
        this.updateGetRecentlyPlaylistsStatus(ApiRequestStatus.Requesting)
      ),
      switchMap((userID) =>
        this.playlistService.getPlaylistsByUserId(userID).pipe(
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

  readonly getPlaylists2Effect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetPlaylists2Status(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.playlistService.getGenre('2').pipe(
          tapResponse(
            (playlists) => {
              this.updatePlaylists2(playlists);
              this.updateGetPlaylists2Status(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetPlaylists2Status(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly getPlaylists3Effect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetPlaylists3Status(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.playlistService.getGenre('3').pipe(
          tapResponse(
            (playlists) => {
              this.updatePlaylists3(playlists);
              this.updateGetPlaylists3Status(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetPlaylists3Status(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly getPlaylists4Effect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetPlaylists4Status(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.playlistService.getGenre('4').pipe(
          tapResponse(
            (playlists) => {
              this.updatePlaylists4(playlists);
              this.updateGetPlaylists4Status(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetPlaylists4Status(ApiRequestStatus.Fail);
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
