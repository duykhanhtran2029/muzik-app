import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Observable, takeWhile } from 'rxjs';
import { Song, StreamState } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from 'src/app/music-player/services/audio-player.service';
import { UtilService } from 'src/app/music-player/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-result-song',
  templateUrl: './result-song.component.html',
  styleUrls: ['./result-song.component.scss']
})
export class ResultSongComponent implements OnInit, OnDestroy {
  @Input() score: number;
  @Input() index: number;
  @Input() song: Song;
  @Input() isSelected = false;
  duration: string;
  componentActive = true;
  state: StreamState;

  constructor(
    public audioService: AudioPlayerService,
    private downloadService: UtilService
  ) { }

  ngOnInit(): void {
    this.score = parseFloat((this.score * 100).toFixed(4))  ;
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
  play() {
    this.audioService.playStream(this.song);
    this.audioService.play();
    this.audioService.addToQueue(this.song);
  }
  addToQueue() {
    this.audioService.addToQueue(this.song);
  }
  togglePlay() {
    if (this.state.song.songId !== this.song.songId) {
      this.audioService.playStream(this.song);
      this.audioService.play();
    } else {
      this.state.playing ? this.audioService.pause() : this.audioService.play();
    }
  }
  download() {
    this.downloadService
      .download(this.song.link.toString())
      .subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = this.song.songName;
        a.click();
        URL.revokeObjectURL(objectUrl);
        a.remove();
      })
  }
}

