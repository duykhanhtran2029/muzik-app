import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { AppState } from 'src/app/store/reducers';
import { MusicPlayerPlaylistService } from '../../services/music-player.playlist.service';
import { getUserId } from '../../store/selectors/core.selector';
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
    private playlistServicve: MusicPlayerPlaylistService,
    private store: Store<AppState>
  ) {}
  songs$ = this.componentStore.songs$;
  artists$ = this.componentStore.artists$;
  userPlaylists: Playlist[] = undefined;
  selectedSong: Song;
  ngOnInit(): void {
    this.componentStore.songs$
      .pipe(takeWhile(() => !this.selectedSong))
      .subscribe((songs) => (this.selectedSong = songs[0]));
    this.componentStore.getSongsEffect();
    this.componentStore.getArtistsEffect();
    this.store.select(getUserId).subscribe((res) => {
      if (res != undefined) {
        this.playlistServicve.getPlaylistsByUserId(res).subscribe((res) => {
          this.userPlaylists = res;
        });
      }
    });
  }
}
