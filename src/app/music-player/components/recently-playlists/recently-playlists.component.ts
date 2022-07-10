import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist.interface';
@Component({
  selector: 'app-recently-playlists',
  templateUrl: './recently-playlists.component.html',
})
export class RecentlyPlaylistsComponent implements OnInit {
  @Input() playlists: Playlist[];
  constructor() {}

  ngOnInit(): void {}
}
