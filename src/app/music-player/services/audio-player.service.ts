import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {
  Subject,
  Observable,
  takeUntil,
  BehaviorSubject,
  repeat,
  Subscription,
} from 'rxjs';
import {
  AudioEvent,
  Song,
  StreamState,
} from 'src/app/interfaces/song.interface';
import { Lyric } from 'src/app/interfaces/lyric.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AudioPlayerService {
  RECOMMEND_URL = environment.apiRecommendUrl;
  constructor(private http: HttpClient) {}
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
    AudioEvent.VOLUMECHANGE,
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
    song:
      JSON.parse(localStorage.getItem('music-player__currentSong')) ??
      undefined,
    queue: JSON.parse(localStorage.getItem('music-player__queue')) ?? [],
    shuffle: false,
    recommendedSongs: [],
    repeat: false,
    lyric: [],
    currentLyric: -1,
  };

  private audioObj: HTMLAudioElement = new Audio();
  private state: StreamState = this.initState;
  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(
    this.state
  );
  private sub: Subscription;

  private streamObservable(url: URL) {
    return new Observable((observer) => {
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

  private getRecommendedSongs(songId: string): Observable<Song[]> {
    const url = `${this.RECOMMEND_URL}/recommend?name_file=${songId}`;
    return this.http.get<Song[]>(url);
  }

  private addEvents(
    obj: HTMLAudioElement,
    events: AudioEvent[],
    handler: (event: Event) => void
  ) {
    events.forEach((event) => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(
    obj: HTMLAudioElement,
    events: AudioEvent[],
    handler: (event: Event) => void
  ) {
    events.forEach((event) => {
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
        this.updateCurrentLyric(this.audioObj.currentTime * 1000);
        this.state.readableCurrentTime = this.formatTime(
          this.state.currentTime
        );
        if (this.state.currentTime === this.state.duration) {
          if (this.state.repeat) {
            this.audioObj.currentTime = 0;
            this.play();
          } else {
            this.next();
          }
        }
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

  private genRandom(index: number) {
    var num = Math.floor(Math.random() * (this.state.queue.length - 1 - 0 + 1));
    return num === index && this.state.queue.length > 1
      ? this.genRandom(index)
      : num;
  }

  public playStream(song: Song) {
    localStorage.setItem('music-player__currentSong', JSON.stringify(song));
    this.state.song = song;
    this.sub = this.streamObservable(song.link).subscribe();
    this.state.lyric = [];
    this.state.currentLyric = -1;
  }

  public loadLyric() {
    const url = this.state.song.linkLyric.toString();
    this.http.get(url, { responseType: 'text' }).subscribe(
      (response) => {
        const arr = response.toString().replace(/\r\n/g, '\n').split('\n');
        arr.forEach((str) => {
          const post1 = str.indexOf('[');
          const post2 = str.indexOf(']');

          const time = str.substring(post1 + 1, post2);
          const remaningLine = str.substring(post2 + 1);
          if (/\d/.test(time[0])) {
            const t = this.convertToLong(time);
            const lyr: Lyric = {
              lyricSentence: remaningLine,
              time: t,
            };
            this.state.lyric.push(lyr);
          }
        });
      },
      (error) => {
        console.error(error);
      }
    );
  }
  private updateCurrentLyric(timer: number) {
    if (this.state.lyric.length !== 0) {
      if (this.state.currentLyric >= 0) {
        for (
          let index = this.state.currentLyric + 1;
          index < this.state.lyric.length;
          index++
        ) {
          const t = this.state.lyric[index].time - 100.0;
          if (timer > t) {
            this.state.currentLyric = index;
            break;
          }
        }
      } else {
        for (let index = 0; index < this.state.lyric.length; index++) {
          if (timer > this.state.lyric[index].time - 100.0) {
            this.state.currentLyric = index;
          }
        }
      }
    }
  }
  public play() {
    this.audioObj.play();
    this.getRecommendedSongs(this.state.song.songId).subscribe(
      (response) => {
        this.state.recommendedSongs = response;
      },
      (error) => {
        console.error('Request failed with error');
      }
    );
  }

  public pause() {
    this.audioObj.pause();
  }

  public stop() {
    this.sub.unsubscribe();
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

  private convertToLong(str: string) {
    const strArr: string[] = str.split(':');
    const sTime: string[] = strArr[1].split('.');

    const min: number = +strArr[0];
    const sec: number = +sTime[0];
    const mil: number = +sTime[1];

    return min * 60 * 1000 + sec * 1000 + mil * 10;
  }

  public getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  public addToQueue(song: Song) {
    const index = this.state.queue.findIndex((s) => s.songId === song.songId);
    if (index === -1) {
      this.state.queue.push(song);
    } else {
      this.state.queue.splice(index, 1);
      this.state.queue.unshift(song);
    }
    localStorage.setItem(
      'music-player__queue',
      JSON.stringify(this.state.queue)
    );
  }

  public removeFromRecommended(song: Song) {
    const index = this.state.recommendedSongs.findIndex(
      (s) => s.songId === song.songId
    );
    if (index > -1) {
      this.state.recommendedSongs.splice(index, 1);
    }
    localStorage.setItem(
      'music-player__queue',
      JSON.stringify(this.state.recommendedSongs)
    );
  }

  public isInQueue(song: Song) {
    return this.state.queue.findIndex((s) => s.songId === song.songId) !== -1;
  }

  public isPlaying(song: Song) {
    return this.state.playing && this.state.song.songId === song.songId;
  }

  public toggleShuffle() {
    this.state.shuffle = !this.state.shuffle;
  }

  public toggleRepeat() {
    this.state.repeat = !this.state.repeat;
  }

  public next() {
    let index = this.state.queue.findIndex(
      (s) => s.songId === this.state.song.songId
    );
    index = this.state.shuffle
      ? this.genRandom(index)
      : index === this.state.queue.length - 1
      ? 0
      : index + 1;
    this.stop();
    this.playStream(this.state.queue[index]);
    this.play();
  }

  public prev() {
    let index = this.state.queue.findIndex(
      (s) => s.songId === this.state.song.songId
    );
    index = this.state.shuffle
      ? this.genRandom(index)
      : index === 0
      ? this.state.queue.length - 1
      : index - 1;
    this.stop();
    this.playStream(this.state.queue[index]);
    this.play();
  }

  public updateRecommend() {
    this.getRecommendedSongs(this.state.song.songId).subscribe(
      (response) => {
        this.state.recommendedSongs = response;
      },
      (error) => {
        console.error('Request failed with error');
      }
    );
  }
}
