import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService, AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { combineLatestWith, mergeMap, takeWhile } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthHelperService } from '../../services/auth-helper.service';
import { setIsAdmin } from '../../store/actions/core.actions';
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
    this.authHelperService.getAPIAccessToken()
      .pipe(
        combineLatestWith(this.authService.user$),
        mergeMap(result => this.authHelperService.getUserRoles(result[0]['access_token'], result[1]?.sub)))
      .subscribe(res => {
      if (res[0]) {
        this.store.dispatch(setIsAdmin({ isAdmin: res[0].id === environment.AUTH0_CONFIG.ADMIN_ROLE_ID }))
      }
    });

    this.store.select(getIsAdmin).pipe(takeWhile(() => this.componentActive)).subscribe(isAdmin => this.isAdmin = isAdmin);
    this.authService.isAuthenticated$.pipe(takeWhile(() => this.componentActive)).subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

}
