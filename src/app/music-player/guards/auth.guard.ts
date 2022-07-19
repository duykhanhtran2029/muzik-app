import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { concatMap, filter, take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/reducers';
import { AuthService } from '../services/auth.service';
import { logIn } from '../store/actions/core.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
        private auth: AuthService,
        private router: Router
    ) { }

    waitForHandleAuthCallbackToComplete(): Observable<boolean> {
        return this.auth.handleCallbackComplete$.pipe(
            filter(complete => complete),
            take(1),
        );
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
        return this.waitForHandleAuthCallbackToComplete().pipe(
            concatMap(() => this.auth.isAuthenticated$.pipe(
                tap(isAuthenticated => {
                    if(!isAuthenticated) {
                        this.store.dispatch(logIn({ payload: state.url }));
                    }
                })
            )),
            concatMap(() => this.auth.isAdmin$.pipe(
                tap(isAdmin => {
                    if(!isAdmin) {
                        this.router.navigate(['error/403']);
                    }
                })
            )),
        );
    }
}
