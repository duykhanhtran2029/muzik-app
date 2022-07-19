import { Component, Input, OnInit } from '@angular/core';
import { Playlist } from 'src/app/interfaces/playlist.interface';
@Component({
  selector: 'app-recently-playlists',
  templateUrl: './recently-playlists.component.html',
})
export class RecentlyPlaylistsComponent {
  @Input() playlists: Playlist[];
  constructor() {}
}
