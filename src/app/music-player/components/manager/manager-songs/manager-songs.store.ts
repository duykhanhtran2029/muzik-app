import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ToastrService } from 'ngx-toastr';
import { Observable, switchMap, tap } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerSongService } from '../../../services/music-player.song.service';

export interface ManagerSongsState {
  songs: Song[];
  getSongsStatus: ApiRequestStatus;
  updateSongStatus: ApiRequestStatus;
  deleteSongStatus: ApiRequestStatus;
  createSongStatus: ApiRequestStatus;
  toggleSongRecognizableStatus1: ApiRequestStatus;
  toggleSongRecognizableStatus2: ApiRequestStatus;

}
export const initialState: ManagerSongsState = {
  songs: [],
  getSongsStatus: undefined,
  updateSongStatus: undefined,
  deleteSongStatus: undefined,
  createSongStatus: undefined,
  toggleSongRecognizableStatus1: undefined,
  toggleSongRecognizableStatus2: undefined
};
@Injectable()
export class ManagerSongsStore extends ComponentStore<ManagerSongsState> {
  //#region ***Selectors***
  readonly songs$: Observable<Song[]> = this.select((state) => state.songs);
  readonly getSongsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getSongsStatus
  );
  readonly updateSongStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.updateSongStatus
  );
  readonly deleteSongStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.deleteSongStatus
  );
  readonly createSongStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.createSongStatus
  );
  readonly toggleSongRecognizableStatus1$: Observable<ApiRequestStatus> = this.select(
    (state) => state.toggleSongRecognizableStatus1
  );
  readonly toggleSongRecognizableStatus2$: Observable<ApiRequestStatus> = this.select(
    (state) => state.toggleSongRecognizableStatus2
  );
  //#endregion

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

  readonly updateUpdateSongsStatus = this.updater(
    (state, updateSongStatus: ApiRequestStatus) => ({
      ...state,
      updateSongStatus,
    })
  );

  readonly updateDeleteSongsStatus = this.updater(
    (state, deleteSongStatus: ApiRequestStatus) => ({
      ...state,
      deleteSongStatus,
    })
  );

  readonly updateCreateSongsStatus = this.updater(
    (state, createSongStatus: ApiRequestStatus) => ({
      ...state,
      createSongStatus,
    })
  );

  readonly updateToggleSongRecognizableStatus1 = this.updater(
    (state, toggleSongRecognizableStatus1: ApiRequestStatus) => ({
      ...state,
      toggleSongRecognizableStatus1,
    })
  );

  readonly updateToggleSongRecognizableStatus2 = this.updater(
    (state, toggleSongRecognizableStatus2: ApiRequestStatus) => ({
      ...state,
      toggleSongRecognizableStatus2,
    })
  );
  //#endregion

  //#region ***Effects***
  readonly getSongsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetSongsStatus(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.songService.getAllSongs().pipe(
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

  readonly deleteSongEffect = this.effect((songId$: Observable<string>) =>
    songId$.pipe(
      tap(() => this.updateDeleteSongsStatus(ApiRequestStatus.Requesting)),
      switchMap((songId) =>
        this.songService.deleteSong(songId).pipe(
          tapResponse(
            () => {
              this.updateDeleteSongsStatus(ApiRequestStatus.Success);
            },
            () => {
              this.updateDeleteSongsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly updateSongEffect = this.effect((song$: Observable<Song>) =>
    song$.pipe(
      tap(() => this.updateUpdateSongsStatus(ApiRequestStatus.Requesting)),
      switchMap((song) =>
        this.songService.updateSong(song).pipe(
          tapResponse(
            () => {
              this.updateUpdateSongsStatus(ApiRequestStatus.Success);
            },
            () => {
              this.updateUpdateSongsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly createSongEffect = this.effect((song$: Observable<Song>) =>
    song$.pipe(
      tap(() => this.updateCreateSongsStatus(ApiRequestStatus.Requesting)),
      switchMap((song) =>
        this.songService.createSong(song).pipe(
          tapResponse(
            () => {
              this.updateCreateSongsStatus(ApiRequestStatus.Success);
            },
            () => {
              this.updateCreateSongsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );
            // 1: music 2: fingerPrinting
  readonly toggleSongRecognizableEffect1 = this.effect((choose$: Observable<{ songId: string, isRecognizable: boolean }>) =>
  choose$.pipe(
      tap(() => this.updateToggleSongRecognizableStatus1(ApiRequestStatus.Requesting)),
      switchMap((choose) =>
        this.songService.toggleSongRecognizable1(choose.songId, choose.isRecognizable).pipe(
          tapResponse(
            () => {
              this.updateToggleSongRecognizableStatus1(ApiRequestStatus.Success);
            },
            () => {
              this.updateToggleSongRecognizableStatus1(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly toggleSongRecognizableEffect2 = this.effect((choose$: Observable<{ songId: string, isRecognizable: boolean }>) =>
  choose$.pipe(
      tap(() => {
        this.updateToggleSongRecognizableStatus2(ApiRequestStatus.Requesting);
      }),
      switchMap((choose) =>
        this.songService.toggleSongRecognizable2(choose.songId, choose.isRecognizable).pipe(
          tapResponse(
            () => {
              this.updateToggleSongRecognizableStatus2(ApiRequestStatus.Success);
            },
            () => {
              this.updateToggleSongRecognizableStatus2(ApiRequestStatus.Fail);
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
