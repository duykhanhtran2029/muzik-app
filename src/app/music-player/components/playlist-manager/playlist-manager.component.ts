import { Component, OnInit } from '@angular/core';
import { PlaylistsStore } from './playlist-manager.store';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CreateNewPlaylistComponent } from './create-new-playlist/create-new-playlist.component';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from '@auth0/auth0-angular';
import { getUserId } from '../../store/selectors/core.selector';
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
    private toastr: ToastrService,
    private store: Store<AppState>
  ) {}

  playlists$ = this.playlistStore.playlists$;
  userID: string = undefined;
  newPlaylistDialogRef: MatDialogRef<CreateNewPlaylistComponent>;

  ngOnInit(): void {
    this.store.select(getUserId).subscribe((res) => {
      if (res != undefined) {
        this.playlistStore.getPlaylistsEffect(res);
        this.userID = res;
      }
    });
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
          if (this.userID) {
            this.playlistStore.getPlaylistsEffect(this.userID);
          }
          break;
      }
    });
  }

  createNewPlaylist(newPlaylist: Playlist) {
    this.playlistStore.createPlaylistsEffect(newPlaylist);
  }
}
