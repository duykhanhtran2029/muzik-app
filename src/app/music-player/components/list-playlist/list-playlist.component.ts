import { Component, Input, OnInit } from '@angular/core';
import { Playlist } from 'src/app/interfaces/playlist.interface';
@Component({
  selector: 'app-list-playlist',
  templateUrl: './list-playlist.component.html',
})
export class ListPlaylistComponent implements OnInit {
  @Input() playlists: Playlist[];
  constructor() {}

  ngOnInit(): void {}
}
