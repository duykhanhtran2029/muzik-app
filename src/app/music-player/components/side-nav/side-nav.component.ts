import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SearchComponent } from '../search/search.component';
import { AudioPlayerService } from '../../services/audio-player.service';

export type ROUTE =
  | 'SEARCH'
  | 'HOME'
  | 'PLAYER'
  | 'ARTIST'
  | 'MANAGER'
  | 'PROFILE'
  | 'PLAYLIST';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    public audioService: AudioPlayerService
  ) {}
  currentRoute: ROUTE = 'HOME';

  ngOnInit(): void {}

  openSearchDialog() {
    this.dialog.open(SearchComponent, {
      width: '800px',
      height: '800px',
      //data: { trigger: new ElementRef(event.currentTarget) }
    });
  }

  setRoute(route: ROUTE) {
    this.currentRoute = route;
    if (route === 'PLAYER') {
      this.audioService.loadLyric();
    }
  }
}
