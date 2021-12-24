import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { AudioContext } from 'angular-audio-context';
import {
  FingerPrintingResult,
  MatchedSong,
} from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';
@Component({
  selector: 'app-playing-bar',
  templateUrl: './playing-bar.component.html',
  styleUrls: ['./playing-bar.component.scss'],
})
export class PlayingBarComponent implements OnInit, OnChanges {
  @Input() song: MatchedSong = null;
  audioContext: AudioContext = null;
  arrayBuffer: any = null;
  isPlaying: boolean = false;
  gain: any = null; // Effect: Change Volume
  source: any = null;
  position: number;
  startTime: number;
  duration: number;
  toggle: string = 'play_arrow';
  constructor() {
    this.audioContext = new AudioContext();
    this.gain = this.audioContext.createGain();
    console.log('Audio Context Initiated');
  }

  ngOnInit(): void {
    if (this.song) {
      this.fetch();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.song = changes['song'].currentValue;
    console.log(this.audioContext);
    this.fetch();
    this.source = null;
  }

  fetch() {
    let xhr = new XMLHttpRequest();

    // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.open('GET', this.song.song.link, true);

    console.log('fetch');

    xhr.responseType = 'arraybuffer';
    xhr.onload = (e: any) => {
      console.log(e);
      this.audioContext.decodeAudioData(e.target.response, (buffer) => {
        this.arrayBuffer = buffer;
      });
    };
    xhr.send();
  }

  connect() {
    if (this.isPlaying) {
      this.pause();
    }
    console.log('connect');
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.arrayBuffer;
    this.source.connect(this.audioContext.destination);
  }
  play(position: number = 0) {
    this.connect();
    this.duration = this.arrayBuffer.duraiton;
    this.position =
      typeof position === 'number' ? position : this.position || 0;
    console.log(this.audioContext.currentTime);
    this.startTime = this.audioContext.currentTime - (this.position || 0);
    this.source.start(
      2,
      this.audioContext.currentTime,
      this.arrayBuffer.duration - this.audioContext.currentTime
    );
    this.isPlaying = true;
  }
  pause() {
    if (this.source) {
      this.source.stop(0);
      this.source = null;
      this.position = this.audioContext.currentTime - this.startTime;
      this.isPlaying = false;
    }
  }
  togglePlay() {
    if (this.isPlaying) {
      this.toggle = 'play_arrow';
      this.pause();
    } else {
      this.toggle = 'pause';
      this.play();
    }
  }

  draw() {
    let progess = this.updatePosition() / this.arrayBuffer.duration;
  }
  updatePosition() {
    this.position = this.isPlaying
      ? this.audioContext.currentTime - this.startTime
      : this.position;
    if (this.position >= this.arrayBuffer.duration) {
      this.position = this.arrayBuffer.duration;
      this.pause();
    }
    return this.position;
  }
}
