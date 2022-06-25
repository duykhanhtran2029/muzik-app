import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { mergeMap, Observable, switchMap, tap } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

export interface SongState {
  songs: Song[];
  getPlaylistSongsStatus: ApiRequestStatus;
  playlist: Playlist;
  getPlaylistStatus: ApiRequestStatus;
  recommendSongs: Song[];
  getPlaylistRecommendSongsStatus: ApiRequestStatus;
}
export const initialState: SongState = {
  songs: [],
  getPlaylistSongsStatus: undefined,
  playlist: undefined,
  getPlaylistStatus: undefined,
  recommendSongs: [],
  getPlaylistRecommendSongsStatus: undefined,
};
@Injectable()
export class PlaylistStore extends ComponentStore<SongState> {
  //#region ***Selectors***
  readonly songs$: Observable<Song[]> = this.select((state) => state.songs);
  readonly getPlaylistSongsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getPlaylistSongsStatus
  );

  readonly playlist$: Observable<Playlist> = this.select(
    (state) => state.playlist
  );
  readonly getPlaylistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getPlaylistStatus
  );

  readonly recommendSongs$: Observable<Song[]> = this.select(
    (state) => state.recommendSongs
  );
  readonly getPlaylistRecommendSongsStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.getPlaylistRecommendSongsStatus);
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***
  readonly updateSongs = this.updater((state, songs: Song[]) => ({
    ...state,
    songs,
  }));

  readonly updateGetPlaylistSongsStatus = this.updater(
    (state, getPlaylistSongsStatus: ApiRequestStatus) => ({
      ...state,
      getPlaylistSongsStatus,
    })
  );

  readonly updatePlaylist = this.updater((state, playlist: Playlist) => ({
    ...state,
    playlist,
  }));

  readonly updateGetPlaylistStatus = this.updater(
    (state, getPlaylistStatus: ApiRequestStatus) => ({
      ...state,
      getPlaylistStatus,
    })
  );

  readonly updateRecommendSongs = this.updater(
    (state, recommendSongs: Song[]) => ({
      ...state,
      recommendSongs,
    })
  );

  readonly updateGetPlaylistRecommendSongsStatus = this.updater(
    (state, getPlaylistRecommendSongsStatus: ApiRequestStatus) => ({
      ...state,
      getPlaylistRecommendSongsStatus,
    })
  );
  //#endregion

  //#region ***Effects***
  readonly getSongsEffect = this.effect((playlistId$: Observable<string>) =>
    playlistId$.pipe(
      tap(() => this.updateGetPlaylistSongsStatus(ApiRequestStatus.Requesting)),
      switchMap((playlistId) =>
        this.playlistService.getPlaylistSongs(playlistId).pipe(
          tapResponse(
            (songs) => {
              this.updateSongs(songs);
              this.updateGetPlaylistSongsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetPlaylistSongsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly getPlaylistEffect = this.effect((playlistId$: Observable<string>) =>
    playlistId$.pipe(
      tap(() => this.updateGetPlaylistSongsStatus(ApiRequestStatus.Requesting)),
      switchMap((playlistId) =>
        this.playlistService.getPlaylist(playlistId).pipe(
          tapResponse(
            (playlist) => {
              console.log(playlist);
              this.updatePlaylist(playlist);
              this.updateGetPlaylistStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetPlaylistStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly getRecommendSongsEffect = this.effect(
    (playlistId$: Observable<string>) =>
      playlistId$.pipe(
        tap(() =>
          this.updateGetPlaylistRecommendSongsStatus(
            ApiRequestStatus.Requesting
          )
        ),
        switchMap((playlistId) =>
          this.playlistService.getPlaylistRecommendSongs(playlistId).pipe(
            tapResponse(
              (songs) => {
                console.log(songs);
                this.updateRecommendSongs(songs);
                this.updateGetPlaylistRecommendSongsStatus(
                  ApiRequestStatus.Success
                );
              },
              (err) => {
                this.updateGetPlaylistRecommendSongsStatus(
                  ApiRequestStatus.Fail
                );
              }
            )
          )
        )
      )
  );
  //#endregion

  constructor(
    private songService: MusicPlayerSongService,
    private playlistService: MusicPlayerPlaylistService
  ) {
    super(initialState);
  }
}
