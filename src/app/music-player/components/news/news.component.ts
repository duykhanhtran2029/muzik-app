import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { Song, StreamState } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from '../../services/audio-player.service';
import { MusicPlayerSongService } from '../../services/music-player.song.service';
import { UtilService } from '../../services/utils.service';
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
    public audioService: AudioPlayerService,
    private downloadService: UtilService,
    private songService: MusicPlayerSongService
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
      song.listens++;
      this.audioService.playStream(song);
      this.audioService.play();
      this.audioService.addToQueue(song);
    } else {
      this.state.playing ? this.audioService.pause() : this.audioService.play();
    }
  }

  download(song: Song) {
    this.downloadService
      .download(song.link.toString())
      .pipe(takeWhile(() => this.componentActive))
      .subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = song.songName;
        a.click();
        URL.revokeObjectURL(objectUrl);
        a.remove();
      });
    this.songService.downloadedSong(song.songId).pipe(takeWhile(() => this.componentActive)).subscribe();
  }
}
