import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerArtistService } from '../../services/music-player.artist.service';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

export interface SongState {
  songs: Song[];
  artists: Artist[];
  getTrendingSongsStatus: ApiRequestStatus;
  getTrendingArtistsStatus: ApiRequestStatus;
}
export const initialState: SongState = {
  songs: [],
  getTrendingSongsStatus: undefined,
  artists: [],
  getTrendingArtistsStatus: undefined,
};
@Injectable()
export class TrendingStore extends ComponentStore<SongState> {
  //#region ***Selectors***
  readonly songs$: Observable<Song[]> = this.select((state) => state.songs);
  readonly getTrendingSongsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getTrendingSongsStatus
  );

  readonly artists$: Observable<Artist[]> = this.select(
    (state) => state.artists
  );
  readonly getTrendingArtistsStatus$: Observable<ApiRequestStatus> =
    this.select((state) => state.getTrendingArtistsStatus);
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***
  readonly updateSongs = this.updater((state, songs: Song[]) => ({
    ...state,
    songs,
  }));

  readonly updateGetTrendingSongsStatus = this.updater(
    (state, getTrendingSongsStatus: ApiRequestStatus) => ({
      ...state,
      getTrendingSongsStatus,
    })
  );

  readonly updateArtists = this.updater((state, artists: Artist[]) => ({
    ...state,
    artists,
  }));

  readonly updateGetTrendingArtistsStatus = this.updater(
    (state, getTrendingArtistsStatus: ApiRequestStatus) => ({
      ...state,
      getTrendingArtistsStatus,
    })
  );

  //#endregion

  //#region ***Effects***
  readonly getSongsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetTrendingSongsStatus(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.songService.getTrendingSong().pipe(
          tapResponse(
            (songs) => {
              this.updateSongs(songs);
              this.updateGetTrendingSongsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetTrendingSongsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );
  readonly getArtistsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() =>
        this.updateGetTrendingArtistsStatus(ApiRequestStatus.Requesting)
      ),
      switchMap(() =>
        this.artistService.getTrendingArtist().pipe(
          tapResponse(
            (artists) => {
              this.updateArtists(artists);
              this.updateGetTrendingArtistsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetTrendingArtistsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );
  //#endregion

  constructor(
    private songService: MusicPlayerSongService,
    private artistService: MusicPlayerArtistService
  ) {
    super(initialState);
  }
}
