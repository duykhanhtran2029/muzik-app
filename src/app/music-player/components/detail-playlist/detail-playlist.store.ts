import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { map, mergeMap, Observable, switchMap, tap } from 'rxjs';
import { Playlist, PlaylistSong } from 'src/app/interfaces/playlist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

export interface SongState {
  songs: Song[];
  getPlaylistSongsStatus: ApiRequestStatus;
  playlist: Playlist;
  getPlaylistStatus: ApiRequestStatus;
  addSongToPlaylistStatus: ApiRequestStatus;
  recommendSongs: Song[];
  getPlaylistRecommendSongsStatus: ApiRequestStatus;
  updatePlaylistStatus: ApiRequestStatus;
  deleteSongFromPlaylist: ApiRequestStatus;
}
export const initialState: SongState = {
  songs: [],
  getPlaylistSongsStatus: undefined,
  playlist: undefined,
  getPlaylistStatus: undefined,
  addSongToPlaylistStatus: undefined,
  recommendSongs: [],
  getPlaylistRecommendSongsStatus: undefined,
  updatePlaylistStatus: undefined,
  deleteSongFromPlaylist: undefined,
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
  readonly addSongToPlaylistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.addSongToPlaylistStatus
  );

  readonly recommendSongs$: Observable<Song[]> = this.select(
    (state) => state.recommendSongs
  );
  readonly getPlaylistRecommendSongsStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.getPlaylistRecommendSongsStatus);

  readonly getUpdatePlaylistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.updatePlaylistStatus
  );

  readonly getDeleteSongFromPlaylistStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.deleteSongFromPlaylist);
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

  readonly updateAddSongToPlaylistStatus = this.updater(
    (state, addSongToPlaylistStatus: ApiRequestStatus) => ({
      ...state,
      addSongToPlaylistStatus,
    })
  );

  readonly updateRecommendSongs = this.updater(
    (state, recommendSongs: Song[]) => ({
      ...state,
      recommendSongs,
    })
  );

  readonly deletFromRecommendSongs = this.updater((state, songId: string) => {
    const recSongs: Song[] = state.recommendSongs.filter(
      (song) => song.songId != songId
    );
    return {
      ...state,
      recommendSongs: recSongs,
    };
  });

  readonly updateGetPlaylistRecommendSongsStatus = this.updater(
    (state, getPlaylistRecommendSongsStatus: ApiRequestStatus) => ({
      ...state,
      getPlaylistRecommendSongsStatus,
    })
  );

  readonly updateUpdatePlaylistStatus = this.updater(
    (state, updatePlaylistStatus: ApiRequestStatus) => ({
      ...state,
      updatePlaylistStatus,
    })
  );

  readonly updateDeleteSongFromPlaylistStatus = this.updater(
    (state, deleteSongFromPlaylist: ApiRequestStatus) => ({
      ...state,
      deleteSongFromPlaylist,
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

  readonly addSongToPlaylistEffect = this.effect(
    (playlistSong$: Observable<PlaylistSong>) =>
      playlistSong$.pipe(
        tap(() =>
          this.updateAddSongToPlaylistStatus(ApiRequestStatus.Requesting)
        ),
        switchMap((song) =>
          this.playlistService.addSongToPlaylist(song).pipe(
            tapResponse(
              (songs) => {
                this.deletFromRecommendSongs(song.songId);
                this.updateSongs(songs);
                this.updateAddSongToPlaylistStatus(ApiRequestStatus.Success);
              },
              (err) => {
                this.updateAddSongToPlaylistStatus(ApiRequestStatus.Fail);
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

  readonly updatePlaylistEffect = this.effect(
    (playlist$: Observable<Playlist>) =>
      playlist$.pipe(
        tap(() => this.updateUpdatePlaylistStatus(ApiRequestStatus.Requesting)),
        switchMap((playlist) =>
          this.playlistService.updatePlaylist(playlist).pipe(
            tapResponse(
              () => {
                this.updateUpdatePlaylistStatus(ApiRequestStatus.Success);
              },
              (err) => {
                this.updateUpdatePlaylistStatus(ApiRequestStatus.Fail);
              }
            )
          )
        )
      )
  );

  readonly deleteSongFromPlaylistEffect = this.effect(
    (playlistSong$: Observable<PlaylistSong>) =>
      playlistSong$.pipe(
        tap(() =>
          this.updateDeleteSongFromPlaylistStatus(ApiRequestStatus.Requesting)
        ),
        switchMap((song) =>
          this.playlistService.deleteSongFromPlaylist(song).pipe(
            tapResponse(
              (songs) => {
                this.updateSongs(songs);
                this.updateDeleteSongFromPlaylistStatus(
                  ApiRequestStatus.Success
                );
              },
              (err) => {
                this.updateDeleteSongFromPlaylistStatus(ApiRequestStatus.Fail);
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
