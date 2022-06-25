import { Component, OnInit } from '@angular/core';
import { PlaylistsStore } from './playlist-manager.store';
@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.scss'],
  providers: [PlaylistsStore],
})
export class PlaylistManagerComponent implements OnInit {
  constructor(private playlistStore: PlaylistsStore) { }


  playlists$ = this.playlistStore.playlists$;

  ngOnInit(): void {
    this.playlistStore.getPlaylistsEffect();
  }

}
