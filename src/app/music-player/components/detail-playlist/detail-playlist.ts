import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlaylistStore } from './detail-playlist.store';
import { Song } from 'src/app/interfaces/song.interface';
import { PlaylistSong } from 'src/app/interfaces/playlist.interface';
import { takeWhile } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail-playlist',
  templateUrl: './detail-playlist.html',
  styleUrls: ['./detail-playlist.scss'],
  providers: [PlaylistStore],
})
export class DetailPlaylistComponent implements OnInit {
  constructor(
    private componentStore: PlaylistStore,
    private route: ActivatedRoute
  ) {}
  songs$ = this.componentStore.songs$;
  playlist$ = this.componentStore.playlist$;
  recommendSongs$ = this.componentStore.recommendSongs$;
  selectedSong: Song;
  playlistId: string;
  selectRecommendSong: Song;

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
  }
}