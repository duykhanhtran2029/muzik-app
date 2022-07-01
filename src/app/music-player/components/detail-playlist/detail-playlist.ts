import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlaylistStore } from './detail-playlist.store';
import { Song } from 'src/app/interfaces/song.interface';
import { Playlist, PlaylistSong } from 'src/app/interfaces/playlist.interface';
import { takeWhile } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
  animateChild,
  // ...
} from '@angular/animations';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DetailPlaylistInformationComponent } from './detail-information/detail-information.component';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';

@Component({
  selector: 'app-detail-playlist',
  templateUrl: './detail-playlist.html',
  styleUrls: ['./detail-playlist.scss'],
  providers: [PlaylistStore],
  animations: [
    trigger('items', [
      transition(':enter', [
        style({ transform: 'scale(0.5)', opacity: 0 }), // initial
        animate(
          '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({ transform: 'scale(1)', opacity: 1 })
        ), // final
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)', opacity: 1, height: '*' }),
        animate(
          '1s cubic-bezier(.8, -0.6, 0.2, 1.5)',
          style({
            transform: 'scale(0.5)',
            opacity: 0,
            height: '0px',
            margin: '0px',
          })
        ),
      ]),
    ]),
    trigger('list', [
      transition(':enter', [query('@items', stagger(300, animateChild()))]),
    ]),
  ],
})
export class DetailPlaylistComponent implements OnInit {
  constructor(
    private componentStore: PlaylistStore,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private _router: Router
  ) {}
  songs$ = this.componentStore.songs$;
  playlist$ = this.componentStore.playlist$;
  recommendSongs$ = this.componentStore.recommendSongs$;
  selectedSong: Song;
  playlistId: string;
  selectRecommendSong: Song;
  detailDialogRef: MatDialogRef<DetailPlaylistInformationComponent>;

  ngOnInit(): void {
    this.playlistId = this.route.snapshot.paramMap.get('id');

    this.componentStore.songs$
      .pipe(takeWhile(() => !this.selectedSong))
      .subscribe((songs) => (this.selectedSong = songs[0]));

    this.componentStore.getSongsEffect(this.playlistId);
    this.componentStore.getPlaylistEffect(this.playlistId);
    this.componentStore.getRecommendSongsEffect(this.playlistId);

    this.componentStore.addSongToPlaylistStatus$.subscribe(
      (addSongToPlaylistStatus) => {
        switch (addSongToPlaylistStatus) {
          case ApiRequestStatus.Success:
            this.toastr.success('Success', 'Add Song Succesfully');
            break;
          case ApiRequestStatus.Fail:
            this.toastr.error('Failed', 'Add Song Failed');
            break;
          case ApiRequestStatus.Requesting:
            break;
        }
      }
    );
    this.componentStore.getDeleteSongFromPlaylistStatus$.subscribe(
      (deleteSongFromPlaylistStatus) => {
        switch (deleteSongFromPlaylistStatus) {
          case ApiRequestStatus.Success:
            this.toastr.success('Success', 'Remove Song Succesfully');
            break;
          case ApiRequestStatus.Fail:
            this.toastr.error('Failed', 'Remove Song Failed');
            break;
          case ApiRequestStatus.Requesting:
            break;
        }
      }
    );

    this.componentStore.getDeletePlaylistStatus$.subscribe(
      (deletePlaylistStatus) => {
        switch (deletePlaylistStatus) {
          case ApiRequestStatus.Success:
            this.toastr.success('Success', 'Delete Playlist Succesfully');
            this._router.navigate(['/app/playlists']);
            break;
          case ApiRequestStatus.Fail:
            this.toastr.error('Failed', 'Delete Playlist Failed');
            break;
          case ApiRequestStatus.Requesting:
            break;
        }
      }
    );
  }

  deletePlaylist(): void {
    this.componentStore.deletePlaylistEffect(this.playlistId);
  }

  addSongToPlaylist(songId: string): void {
    const playlistSong: PlaylistSong = {
      playlistId: this.playlistId,
      songId: songId,
    };

    this.componentStore.addSongToPlaylistEffect(playlistSong);
    this.selectRecommendSong = undefined;
  }

  deleteSongFromPlaylist(songId: string): void {
    const playlistSong: PlaylistSong = {
      playlistId: this.playlistId,
      songId: songId,
    };

    this.componentStore.deleteSongFromPlaylistEffect(playlistSong);
    this.selectedSong = undefined;
  }
  openDetail(playlist: Playlist) {
    this.detailDialogRef = this.dialog.open(
      DetailPlaylistInformationComponent,
      {
        data: {
          playlist: playlist,
          store: this.componentStore,
        },
      }
    );

    this.detailDialogRef.afterClosed().subscribe((created) => {
      switch (created) {
        case undefined:
          break;
        case false:
          this.toastr.error('Failed', 'Playlist Created Failed');
          break;
        default:
          this.toastr.success('Success', 'Playlist Created');
          this.componentStore.getPlaylistEffect(this.playlistId);
          break;
      }
    });
  }
}
