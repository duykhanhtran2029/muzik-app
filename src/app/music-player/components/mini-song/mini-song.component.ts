import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { takeWhile } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
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

  constructor(private audioService: AudioPlayerService) { }

  ngOnInit(): void {
    const audioObj = new Audio();
    audioObj.src = this.song.link.toString();
    audioObj.addEventListener(
      'loadedmetadata',
      () => {
        this.duration = moment.utc(audioObj.duration * 1000).format('mm:ss');
      }
    );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  play() {
    this.audioService.playStream(this.song).pipe(takeWhile(() => this.componentActive)).subscribe();
    this.audioService.play();
  }

}
