import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';
import { TrendingStore } from './trending.store';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  providers: [TrendingStore],
})
export class TrendingComponent implements OnInit {
  constructor(
    private componentStore: TrendingStore,
    private playlistServicve: MusicPlayerPlaylistService
  ) {}
  songs$ = this.componentStore.songs$;
  artists$ = this.componentStore.artists$;
  userPlaylists: Playlist[];
  selectedSong: Song;
  ngOnInit(): void {
    this.componentStore.songs$
      .pipe(takeWhile(() => !this.selectedSong))
      .subscribe((songs) => (this.selectedSong = songs[0]));
    this.componentStore.getSongsEffect();
    this.componentStore.getArtistsEffect();
    this.playlistServicve
      .getPlaylistsByUserId('google-oauth2|114795482044392002727')
      .subscribe((res) => {
        this.userPlaylists = res;
      });
  }
}
