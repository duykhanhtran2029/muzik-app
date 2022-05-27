import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerArtistService } from '../../../services/music-player.artist.service';
import { MusicPlayerSongService } from '../../../services/music-player.song.service';

export interface ManagerSongsState {
  songs: Song[];
  getSongsStatus: ApiRequestStatus;
  updateSongStatus: ApiRequestStatus;
  deleteSongStatus: ApiRequestStatus;
  createSongStatus: ApiRequestStatus;
}
export const initialState: ManagerSongsState = {
  songs: [],
  getSongsStatus: undefined,
  updateSongStatus: undefined,
  deleteSongStatus: undefined,
  createSongStatus: undefined,
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
  
  //#endregion

  constructor(
    private songService: MusicPlayerSongService,
    private artistService: MusicPlayerArtistService) {
    super(initialState);
  }
}
