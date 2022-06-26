import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlaylistStore } from './detail-playlist.store';
import { Song } from 'src/app/interfaces/song.interface';
import { Playlist, PlaylistSong } from 'src/app/interfaces/playlist.interface';
import { takeWhile } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger,
  animateChild,
  // ...
} from '@angular/animations';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DetailPlaylistInformationComponent } from './detail-information/detail-information.component';

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
    private dialog: MatDialog
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
  }

  addSongToPlaylist(songId: string): void {
    const playlistSong: PlaylistSong = {
      playlistId: this.playlistId,
      songId: songId,
    };

    this.componentStore.addSongToPlaylistEffect(playlistSong);
    this.selectRecommendSong = undefined;
  }
  openDetail(playlist: Playlist) {
    this.detailDialogRef = this.dialog.open(
      DetailPlaylistInformationComponent,
      {
        data: playlist,
      }
    );
  }
}
