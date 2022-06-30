import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from '../search/search.component';
import { AudioPlayerService } from '../../services/audio-player.service';
import { NavigationStart, Router } from '@angular/router';
import { Observable, takeWhile } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { mergeMap, combineLatestWith } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AuthHelperService } from '../../services/auth-helper.service';
import { setIsAdmin } from '../../store/actions/core.actions';
import { environment } from 'src/environments/environment';
import { getIsAdmin } from '../../store/selectors/core.selector';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {

  @Input() isAuthenticated = false;
  @Input() isAdmin = false;

  constructor(
    private dialog: MatDialog,
    public audioService: AudioPlayerService,
    private router: Router,
    private authService: AuthService,
  ) { }

  componentActive = true;
  currentRoute = window.location.href;

  ngOnInit(): void {
    this.router.events.pipe(takeWhile(() => this.componentActive)).subscribe((route) => {
      if (route instanceof NavigationStart) {
        this.currentRoute = route.url;
      }
    });
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
