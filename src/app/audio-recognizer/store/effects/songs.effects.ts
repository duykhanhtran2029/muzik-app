import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as actions from '../actions/songs.actions';
import { SongService } from 'src/app/audio-recognizer/services/songs.service';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';

@Injectable()
export class SongEffects {

    getSongs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.getSongs),
            concatMap(() => this.songService.getAllSongs()),
            map(songs => actions.getSongsSuccess({ songs })),
            catchError(async (error) => actions.getSongsFailure({ error })),
        )
    );

    createSong$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.createSong),
            concatMap((action) => this.songService.createSong(action.song).pipe(
                map((song) => actions.createSongSuccess({ song })),
                catchError(async (error) => actions.createSongFailure({ error })),
            )
            )),
    );

    updateSong$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.updateSong),
            concatMap((action) => this.songService.updateSong(action.song).pipe(
                map((song) => actions.updateSongSuccess({ song})),
                catchError(async (error) => actions.updateSongFailure({ error })),
            )
            )),
    );

    deleteSong$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.deleteSong),
            concatMap((action) => this.songService.deleteSong(action.songId)),
            map((song) => actions.deleteSongSuccess({ song})),
            catchError(async (error) => actions.deleteSongFailure({ error })),
        ),
    );

    fingerPrinting$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.fingerPrinting),
            concatMap((action) => this.songService.fingerPrinting(action.formData).pipe(
                map((fingerPrintingResult) => actions.fingerPrintingSuccess({ fingerPrintingResult })),
                catchError(async (error) => actions.fingerPrintingFailure({ error })),
                tap(() => this.router.navigateByUrl('app/result'))
            )),
        )
    );

    constructor(private songService: SongService, private actions$: Actions, private router: Router) { }
}
