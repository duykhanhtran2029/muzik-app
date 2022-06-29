import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from '../search/search.component';
import { AudioPlayerService } from '../../services/audio-player.service';
import { NavigationStart, Router } from '@angular/router';
import { Observable, takeWhile } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { mergeMap, combineLatestWith } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AuthHelperService } from '../../services/auth-helper.service';
import { setIsAdmin } from '../../store/actions/songs.actions';
import { environment } from 'src/environments/environment';
import { getIsAdmin } from '../../store/selectors/songs.selector';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  constructor(
    private dialog: MatDialog,
    public audioService: AudioPlayerService,
    private router: Router,
    private store: Store<AppState>,
    private authService: AuthService,
    private authHelperService: AuthHelperService
  ) { }

  componentActive = true;
  currentRoute = window.location.href;
  isAuthenticated = false;
  isAdmin= false;

  ngOnInit(): void {
    this.router.events.pipe(takeWhile(() => this.componentActive)).subscribe((route) => {
      if (route instanceof NavigationStart) {
        this.currentRoute = route.url;
      }
    });

    this.authHelperService.getAPIAccessToken().pipe(
      combineLatestWith(this.authService.user$),
      mergeMap(result => this.authHelperService.getUserRoles(result[0]['access_token'], result[1]?.sub))
    ).subscribe(res => {
      if (res) {
        this.store.dispatch(setIsAdmin({ isAdmin: res[0].id === environment.AUTH0_CONFIG.ADMIN_ROLE_ID }))
      }
    });

    this.store.select(getIsAdmin).pipe(takeWhile(() => this.componentActive)).subscribe(isAdmin => this.isAdmin = isAdmin);
    this.authService.isAuthenticated$.pipe(takeWhile(() => this.componentActive)).subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);

  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  openSearchDialog() {
    this.dialog.open(SearchComponent, {
      width: '800px',
      height: '800px',
      panelClass: 'no-padding-dialog',
    });
  }

  onLogin() {
    this.authService.loginWithRedirect();
  }

  onLogout() {
    this.authService.logout();
  }

}
