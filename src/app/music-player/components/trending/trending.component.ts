import { Component, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { TrendingStore } from './trending.store';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.scss'],
  providers: [TrendingStore]
})
export class TrendingComponent implements OnInit {

  constructor(
    private componentStore: TrendingStore) { }
  songs$ = this.componentStore.songs$;
  artists$ = this.componentStore.artists$;
  selectedSong: Song;
  ngOnInit(): void {
    this.componentStore.songs$.pipe(takeWhile(() => !this.selectedSong)).subscribe(songs => this.selectedSong = songs[0]);
    this.componentStore.getSongsEffect();
    this.componentStore.getArtistsEffect();
  }
}
