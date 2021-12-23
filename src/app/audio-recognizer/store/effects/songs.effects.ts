import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as actions from '../actions/songs.actions';
import { SongService } from 'src/app/audio-recognizer/services/songs.service';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';

@Injectable()
export class SongEffects {

    loadSongs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.getSongs),
            concatMap(() => this.songService.getAllSongs()),
            map(songs => actions.getSongsSuccess({ songs }))
        )
    );

    fingerPrinting$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.fingerPrinting),
            concatMap((action) => this.songService.fingerPrinting(action.formData).pipe(
                map((res: FingerPrintingResult) => actions.fingerPrintingSuccess({ fingerPrintingResult: res})),
                catchError(async (err) => actions.fingerPrintingFailure({ error: err })),
                tap(() => this.router.navigateByUrl('app/result'))
            )),
        )
    );

    deleteSong$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.deleteSong),
            concatMap((action) => this.songService.deleteSong(action.songId))
        ),
        { dispatch: false }
    );

    updateSong$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.updateSong),
            concatMap((action) => this.songService.updateSong(action.update.id, action.update.changes))
        ),
        { dispatch: false }
    );

    constructor(private songService: SongService, private actions$: Actions, private router: Router) { }
}
