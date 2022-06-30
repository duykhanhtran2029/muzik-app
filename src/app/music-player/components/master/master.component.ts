import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, takeWhile, skipWhile, tap, concatMap } from 'rxjs';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { AuthHelperService } from '../../services/auth-helper.service';
import { setIsAdmin, setUserId } from '../../store/actions/core.actions';
import { getIsAdmin } from '../../store/selectors/core.selector';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, OnDestroy {

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private authHelperService: AuthHelperService
  ) { }

  componentActive = true;
  isAdmin = false;
  isAuthenticated = false;

  ngOnInit(): void {
    this.authService.user$.pipe(
      takeWhile(() => this.componentActive),
      combineLatestWith(this.authHelperService.getAPIAccessToken()),
      tap(([user, token]) => {
        if (user) {
          this.store.dispatch(setUserId({ userId: user.sub }));
          this.isAuthenticated = true;
        }
      }),
      skipWhile(([user, token]) => user === null),
      concatMap(([user, token]) => this.authHelperService.getUserRoles(token['access_token'], user.sub))
    ).subscribe(res => {
      if(res[0]) {
        this.isAdmin = res[0].id === environment.AUTH0_CONFIG.ADMIN_ROLE_ID;
      }
      this.store.dispatch(setIsAdmin({ isAdmin: this.isAdmin }));
    });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

}
