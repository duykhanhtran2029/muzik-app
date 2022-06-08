import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Artist, RawArtist } from 'src/app/interfaces/artist.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerArtistService } from '../../../services/music-player.artist.service';

export interface ManagerArtistsState {
  artists: Artist[];
  getArtistsStatus: ApiRequestStatus;
  updateArtistStatus: ApiRequestStatus;
  deleteArtistStatus: ApiRequestStatus;
  createArtistStatus: ApiRequestStatus;
}
export const initialState: ManagerArtistsState = {
  artists: [],
  getArtistsStatus: undefined,
  updateArtistStatus: undefined,
  deleteArtistStatus: undefined,
  createArtistStatus: undefined,
};
@Injectable()
export class ManagerArtistsStore extends ComponentStore<ManagerArtistsState> {
  //#region ***Selectors***
  readonly artists$: Observable<Artist[]> = this.select((state) => state.artists);
  readonly getArtistsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getArtistsStatus
  );
  readonly updateArtistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.updateArtistStatus
  );
  readonly deleteArtistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.deleteArtistStatus
  );
  readonly createArtistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.createArtistStatus
  );
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***
  readonly updateArtists = this.updater((state, artists: Artist[]) => ({
    ...state,
    artists,
  }));

  readonly updateGetArtistsStatus = this.updater(
    (state, getArtistsStatus: ApiRequestStatus) => ({
      ...state,
      getArtistsStatus,
    })
  );

  readonly updateUpdateArtistsStatus = this.updater(
    (state, updateArtistStatus: ApiRequestStatus) => ({
      ...state,
      updateArtistStatus,
    })
  );

  readonly updateDeleteArtistsStatus = this.updater(
    (state, deleteArtistStatus: ApiRequestStatus) => ({
      ...state,
      deleteArtistStatus,
    })
  );

  readonly updateCreateArtistsStatus = this.updater(
    (state, createArtistStatus: ApiRequestStatus) => ({
      ...state,
      createArtistStatus,
    })
  );
  //#endregion

  //#region ***Effects***
  readonly getArtistsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetArtistsStatus(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.artistService.getAllArtists().pipe(
          tapResponse(
            (artists) => {
              this.updateArtists(artists);
              this.updateGetArtistsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetArtistsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly deleteArtistEffect = this.effect((id$: Observable<string>) =>
    id$.pipe(
      tap(() => this.updateDeleteArtistsStatus(ApiRequestStatus.Requesting)),
      switchMap((id) =>
        this.artistService.deleteArtist(id).pipe(
          tapResponse(
            () => {
              this.updateDeleteArtistsStatus(ApiRequestStatus.Success);
            },
            () => {
              this.updateDeleteArtistsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly updateArtistEffect = this.effect((artist$: Observable<Artist>) =>
    artist$.pipe(
      tap(() => this.updateUpdateArtistsStatus(ApiRequestStatus.Requesting)),
      switchMap((artist) =>
        this.artistService.updateArtist(artist).pipe(
          tapResponse(
            () => {
              this.updateUpdateArtistsStatus(ApiRequestStatus.Success);
            },
            () => {
              this.updateUpdateArtistsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly createArtistEffect = this.effect((artist$: Observable<RawArtist>) =>
  artist$.pipe(
    tap(() => this.updateCreateArtistsStatus(ApiRequestStatus.Requesting)),
    switchMap((artist) =>
      this.artistService.createArtist(artist).pipe(
        tapResponse(
          () => {
            this.updateCreateArtistsStatus(ApiRequestStatus.Success);
          },
          () => {
            this.updateCreateArtistsStatus(ApiRequestStatus.Fail);
          }
        )
      )
    )
  )
);

  //#endregion

  constructor(
    private artistService: MusicPlayerArtistService) {
    super(initialState);
  }
}
