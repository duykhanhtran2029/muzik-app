import { Component, OnInit } from '@angular/core';
import { PlaylistsStore } from './playlist-manager.store';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateNewPlaylistComponent } from './create-new-playlist/create-new-playlist.component';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-playlist-manager',
  templateUrl: './playlist-manager.component.html',
  styleUrls: ['./playlist-manager.component.scss'],
  providers: [PlaylistsStore],
})
export class PlaylistManagerComponent implements OnInit {
  constructor(
    private playlistStore: PlaylistsStore,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  playlists$ = this.playlistStore.playlists$;
  newPlaylistDialogRef: MatDialogRef<CreateNewPlaylistComponent>;

  ngOnInit(): void {
    this.playlistStore.getPlaylistsEffect();
  }

  openNewPlaylist() {
    this.newPlaylistDialogRef = this.dialog.open(CreateNewPlaylistComponent, {
      data: this.playlistStore,
    });
    this.newPlaylistDialogRef.afterClosed().subscribe((created) => {
      switch (created) {
        case undefined:
          break;
        case false:
          this.toastr.error('Failed', 'Playlist Created Failed');
          break;
        default:
          this.toastr.success('Success', 'Playlist Created');
          this.playlistStore.getPlaylistsEffect();
          break;
      }
    });
  }

  createNewPlaylist(newPlaylist: Playlist) {
    this.playlistStore.createPlaylistsEffect(newPlaylist);
  }
}
