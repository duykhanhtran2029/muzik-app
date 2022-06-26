import { Component, OnInit } from '@angular/core';
import { PlaylistsStore } from './playlist-manager.store';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateNewPlaylistComponent } from './create-new-playlist/create-new-playlist.component';
@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.scss'],
  providers: [PlaylistsStore],
})
export class PlaylistManagerComponent implements OnInit {
  constructor(
    private playlistStore: PlaylistsStore,
    private dialog: MatDialog
  ) {}

  playlists$ = this.playlistStore.playlists$;
  newPlaylistDialogRef: MatDialogRef<CreateNewPlaylistComponent>;

  ngOnInit(): void {
    this.playlistStore.getPlaylistsEffect();
  }

  createNewPlaylist() {
    this.newPlaylistDialogRef = this.dialog.open(CreateNewPlaylistComponent);
  }
}
