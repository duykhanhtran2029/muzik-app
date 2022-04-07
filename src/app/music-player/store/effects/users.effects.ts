import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as actions from '../actions/user.actions';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/interfaces/user.interface';

@Injectable()
export class UserEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.login),
      concatMap((action) =>
        this.userService.login(action.account).pipe(
          map((user) => actions.loginSuccess({ user })),
          catchError(async (error) => actions.loginFailure({ error }))
        )
      )
    )
  );

  constructor(
    private userService: UserService,
    private actions$: Actions,
    private router: Router
  ) {}
}
