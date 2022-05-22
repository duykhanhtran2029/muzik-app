import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { takeWhile } from 'rxjs';
import { Song, StreamState } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from '../../services/audio-player.service';

@Component({
  selector: 'app-mini-song',
  templateUrl: './mini-song.component.html',
  styleUrls: ['./mini-song.component.scss']
})
export class MiniSongComponent implements OnInit, OnDestroy {
  @Input() song: Song;
  duration: string;
  componentActive = true;
  state: StreamState;

  constructor(public audioService: AudioPlayerService) { }

  ngOnInit(): void {
    const audioObj = new Audio();
    audioObj.src = this.song.link.toString();
    audioObj.addEventListener(
      'loadedmetadata',
      () => {
        this.duration = moment.utc(audioObj.duration * 1000).format('mm:ss');
      }
    );
    this.audioService.getState().pipe(takeWhile(() => this.componentActive)).subscribe(state => this.state = state);
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  togglePlay() {
    if(this.state.song !== this.song) {
      this.audioService.playStream(this.song);
      this.audioService.play();
    } else {
      this.state.playing ? this.audioService.pause() : this.audioService.play();
    }

  }

}
