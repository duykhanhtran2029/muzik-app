import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Subject, Observable, takeUntil, BehaviorSubject } from 'rxjs';
import { AudioEvent, Song, StreamState } from 'src/app/interfaces/song.interface';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {

  constructor() {}
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
    muted: false,
    song: JSON.parse(localStorage.getItem('music-player__currentSong')) ?? undefined,
    queue: JSON.parse(sessionStorage.getItem('music-player__queue')) ?? [],
  };

  private stop$ = new Subject<void>();
  private audioObj: HTMLAudioElement = new Audio();
  private state: StreamState = this.initState;
  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

  private streamObservable(url: URL) {
    return new Observable(observer => {
      this.audioObj.src = url.toString();
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
  public playStream(song: Song) {
    localStorage.setItem('music-player__currentSong', JSON.stringify(song));
    this.state.song = song;
    this.streamObservable(song.link).pipe(takeUntil(this.stop$)).subscribe();
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

  public addToQueue(song: Song) {
    const index = this.state.queue.findIndex(s => s.songId === song.songId);
    if(index === -1) {
      this.state.queue.push(song)
    } else {
      this.state.queue.splice(index, 1);
      this.state.queue.unshift(song);
    }
    sessionStorage.setItem('music-player__queue', JSON.stringify(this.state.queue));
  }

  public isInQueue(song: Song) {
    return this.state.queue.findIndex(s => s.songId === song.songId) !== -1;
  }

  public isPlaying(song: Song) {
    return this.state.playing && this.state.song.songId === song.songId;
  }
}
