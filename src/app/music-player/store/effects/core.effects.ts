import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as actions from '../actions/core.actions';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

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

  constructor(
    private songService: MusicPlayerSongService,
    private actions$: Actions,
    private router: Router
  ) {}
}
