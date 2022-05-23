import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { MusicPlayerArtistService } from '../../services/music-player.artist.service';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

export interface ArtistState {
  songs: Song[];
  artist: Artist;
  getArtistStatus: ApiRequestStatus;
  getSongsStatus: ApiRequestStatus;
}
export const initialState: ArtistState = {
  songs: [],
  artist: undefined,
  getArtistStatus: undefined,
  getSongsStatus: undefined,
};
@Injectable()
export class ArtistStore extends ComponentStore<ArtistState> {
  //#region ***Selectors***
  readonly songs$: Observable<Song[]> = this.select((state) => state.songs);
  readonly artist$: Observable<Artist> = this.select((state) => state.artist);
  readonly getArtistStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getArtistStatus
  );
  readonly getSongsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getSongsStatus
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

  readonly updateArtist = this.updater((state, artist: Artist) => ({
    ...state,
    artist,
  }));

  readonly updateGetArtistStatus = this.updater(
    (state, getArtistStatus: ApiRequestStatus) => ({
      ...state,
      getArtistStatus,
    })
  );
  //#endregion

  //#region ***Effects***
  readonly getSongsEffect = this.effect((artistId$: Observable<string>) =>
  artistId$.pipe(
      tap(() => this.updateGetSongsStatus(ApiRequestStatus.Requesting)),
      switchMap((artistId) =>
        this.artistService.getArtistSongs(artistId).pipe(
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
  readonly getArtistEffect = this.effect((artistId$: Observable<string>) =>
    artistId$.pipe(
      tap(() => this.updateGetArtistStatus(ApiRequestStatus.Requesting)),
      switchMap((artistId) =>
        this.artistService.getArtist(artistId).pipe(
          tapResponse(
            (artist) => {
              this.updateArtist(artist);
              this.updateGetArtistStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetArtistStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );
  //#endregion

  constructor(
    private artistService: MusicPlayerArtistService
  ) {
    super(initialState);
  }
}
