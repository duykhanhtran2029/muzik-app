import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from '../search/search.component';
import { AudioPlayerService } from '../../services/audio-player.service';
import { NavigationStart, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { Auth0Service } from '../../services/auth0.service';
import { mergeMap, combineLatestWith } from 'rxjs/operators';

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
    public authService: AuthService,
    private auth0Service: Auth0Service
  ) { }
  componentActive = true;
  currentRoute = window.location.href;
  ngOnInit(): void {
    this.router.events
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((route) => {
        if (route instanceof NavigationStart) {
          this.currentRoute = route.url;
        }
      });

      this.auth0Service.getAPIAccessToken().pipe(
        combineLatestWith(this.authService.user$),
        mergeMap(result => this.auth0Service.getUserRoles(result[0]['access_token'], result[1]['sub']))
      ).subscribe(res => this.auth0Service.setRole(res[0].id));
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }
  openSearchDialog() {
    this.dialog.open(SearchComponent, {
      width: '800px',
      height: '800px',
      panelClass: 'no-padding-dialog',
      //data: { trigger: new ElementRef(event.currentTarget) }
    });
  }
}
