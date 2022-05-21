import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { takeWhile } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from 'src/app/music-player/services/audio-player.service';

@Component({
  selector: 'app-top-song',
  templateUrl: './top-song.component.html',
  styleUrls: ['./top-song.component.scss']
})
export class TopSongComponent implements OnInit, OnDestroy {
  @Input() index: number;
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
  addToQueue() {
    this.audioService.addToQueue(this.song);
  }
}
