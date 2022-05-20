import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject, Observable, takeUntil, BehaviorSubject } from 'rxjs';
import { AudioEvent, StreamState } from 'src/app/interfaces/song.interface';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  constructor() { }
  private audioEvents: AudioEvent[] = [
    AudioEvent.ENDED,
    AudioEvent.ERROR,
    AudioEvent.PLAY,
    AudioEvent.PLAYING,
    AudioEvent.PAUSE,
    AudioEvent.TIMEUPDATE,
    AudioEvent.CANPLAY,
    AudioEvent.LOADEDMETADATA,
    AudioEvent.LOADSTART,
    AudioEvent.VOLUMECHANGE
  ];
  private initState: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
    volume: 1,
    muted: false
  };

  private stop$ = new Subject<void>();
  private audioObj = new Audio();
  private state: StreamState = this.initState;
  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);


  private streamObservable(url: string) {
    return new Observable(observer => {
      this.audioObj.src = url;
      this.audioObj.volume = this.state.volume;
      this.audioObj.load();

      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);
      return () => {
        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        this.resetState();
      };
    });
  }

  private addEvents(obj: HTMLAudioElement, events: AudioEvent[], handler: (event: Event) => void) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj: HTMLAudioElement, events: AudioEvent[], handler: (event: Event) => void) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  private updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case 'volumechange':
        this.state.volume = this.audioObj.volume;
        this.state.muted = this.audioObj.muted;
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  private resetState() {
    this.state = this.initState;
  }
  public playStream(url: string) {
    return this.streamObservable(url).pipe(takeUntil(this.stop$));
  }

  public play() {
    this.audioObj.play();
  }

  public pause() {
    this.audioObj.pause();
  }

  public stop() {
    this.stop$.next();
  }

  public seekTo(seconds: number) {
    this.audioObj.currentTime = seconds;
  }

  public setVolumeTo(volume: number) {
    this.audioObj.volume = volume;
  }

  public toggleMute() {
    this.audioObj.muted = !this.audioObj.muted;
  }

  public formatTime(time: number, format: string = 'mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  public getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }
}
