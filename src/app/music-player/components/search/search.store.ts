import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerArtistService } from '../../services/music-player.artist.service';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

export interface SearchState {
  songs: Song[];
  artists: Artist[];
  searchSongsStatus: ApiRequestStatus;
  searchArtistsStatus: ApiRequestStatus;
}
export const initialState: SearchState = {
  songs: [],
  artists: [],
  searchSongsStatus: undefined,
  searchArtistsStatus: undefined,
};
@Injectable()
export class SearchStore extends ComponentStore<SearchState> {
  //#region ***Selectors***
  readonly songs$: Observable<Song[]> = this.select((state) => state.songs);
  readonly getSearchSongsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.searchSongsStatus
  );
  readonly artists$: Observable<Artist[]> = this.select((state) => state.artists);
  readonly getSearchArtistsStatusStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.searchArtistsStatus
  );
  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***
  readonly updateSongs = this.updater((state, songs: Song[]) => ({
    ...state,
    songs,
  }));

  readonly updateSearchSongsStatus = this.updater(
    (state, searchSongsStatus: ApiRequestStatus) => ({
      ...state,
      searchSongsStatus,
    })
  );

  readonly updateArtists = this.updater((state, artists: Artist[]) => ({
    ...state,
    artists,
  }));

  readonly updateSearchArtistsStatus = this.updater(
    (state, searchArtistsStatus: ApiRequestStatus) => ({
      ...state,
      searchArtistsStatus,
    })
  );
  //#endregion

  //#region ***Effects***
  readonly searchSongsEffect = this.effect((searchKey$: Observable<string>) =>
  searchKey$.pipe(
      tap(() => this.updateSearchSongsStatus(ApiRequestStatus.Requesting)),
      switchMap((searchKey: string) =>
        this.songService.searchSongs(searchKey).pipe(
          tapResponse(
            (songs) => {
              this.updateSongs(songs);
              this.updateSearchSongsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateSearchSongsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );

  readonly searchArtistsEffect = this.effect((searchKey$: Observable<string>) =>
  searchKey$.pipe(
      tap(() => this.updateSearchArtistsStatus(ApiRequestStatus.Requesting)),
      switchMap((searchKey: string) =>
        this.artistService.searchArtists(searchKey).pipe(
          tapResponse(
            (artists) => {
              this.updateArtists(artists);
              this.updateSearchArtistsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateSearchArtistsStatus(ApiRequestStatus.Fail);
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
