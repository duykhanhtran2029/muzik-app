import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { Song, StreamState } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from '../../services/audio-player.service';
import { NewsStore } from './news.store';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  providers: [NewsStore],
})
export class NewsComponent implements OnInit, OnDestroy {
  constructor(
    private componentStore: NewsStore,
    public audioService: AudioPlayerService
  ) {}

  songs$ = this.componentStore.songs$;
  componentActive = true;
  state: StreamState;

  ngOnInit(): void {
    this.componentStore.getSongsEffect();
    this.audioService
      .getState()
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((state) => (this.state = state));
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  togglePlay(song: Song) {
    if (this.state.song.songId !== song.songId) {
      this.audioService.playStream(song);
      this.audioService.play();
      this.audioService.addToQueue(song);
    } else {
      this.state.playing ? this.audioService.pause() : this.audioService.play();
    }
  }
}
