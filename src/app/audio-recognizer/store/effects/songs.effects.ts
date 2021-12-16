import { createEffect, Actions, ofType } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as actions from '../actions/songs.actions';
import { SongService } from 'src/app/audio-recognizer/services/songs.service';

@Injectable()
export class SongEffects {

    loadSongs$ = createEffect(() =>
        this.actions$.pipe(
            ofType(actions.getSongs),
            concatMap(() => this.songService.getAllSongs()),
            map(songs => actions.getSongsSuccess({ songs }))
        )
    );

    constructor(private songService: SongService, private actions$: Actions, private router: Router) { }
}
