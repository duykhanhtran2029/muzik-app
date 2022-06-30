import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/reducers';
import { getIsAdmin } from '../store/selectors/core.selector';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private store: Store<AppState>,
    ) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | UrlTree | boolean {
        return this.store.select(getIsAdmin)
    }
}
