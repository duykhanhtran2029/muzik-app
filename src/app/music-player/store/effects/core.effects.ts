import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as actions from '../actions/core.actions';
import { MusicPlayerSongService } from '../../services/music-player.song.service';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class CoreEffects {
  getSongs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.getSongs),
      concatMap(() => this.songService.getAllSongs()),
      map((songs) => actions.getSongsSuccess({ songs })),
      catchError(async (error) => actions.getSongsFailure({ error }))
    )
  );

  getRecommendSongs$ = createEffect(() =>
  this.actions$.pipe(
    ofType(actions.getRecommendSongs),
    concatMap((action) => this.songService.getRecommendedSongs(action.userId)),
    map((songs) => actions.getRecommendSongsSuccess({ recommendSongs: songs })),
    catchError(async (error) => actions.getRecommendSongsFailure({ error }))
  )
);

  fingerPrinting$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.fingerPrinting),
      concatMap((action) =>
        this.songService.fingerPrinting(action.fileName).pipe(
          map((fingerPrintingResult) => {
            return actions.fingerPrintingSuccess({ fingerPrintingResult })
          }
          ),
          catchError(async (error) => actions.fingerPrintingFailure({ error })),
          tap(() => this.router.navigateByUrl('app/result'))
        )
      )
    )
  );

  login$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.logIn),
      tap((action) => {
        const url = action.payload || '/';
        this.authService.login(url);
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () => this.actions$.pipe(
      ofType(actions.logOut),
      tap(() => {
        this.authService.logout();
      })
    ),
    { dispatch: false }
  );

  constructor(
    private songService: MusicPlayerSongService,
    private actions$: Actions,
    private router: Router,
    private authService: AuthService
  ) { }
}
