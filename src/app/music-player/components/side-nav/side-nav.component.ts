import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SearchComponent } from '../search/search.component';
import { AudioPlayerService } from '../../services/audio-player.service';
import { NavigationStart, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  constructor(
    private dialog: MatDialog,
    public audioService: AudioPlayerService,
    private router: Router
  ) {}
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
