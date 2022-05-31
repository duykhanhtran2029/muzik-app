import { Component, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { AudioPlayerService } from '../../services/audio-player.service';
import { Lyric } from 'src/app/interfaces/lyric.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { takeWhile } from 'rxjs';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {
  constructor(
    public audioService: AudioPlayerService,
    private elem: ElementRef
  ) {}

  lyric: Lyric[];
  song: Song;
  currentLyric: number;
  componentActive = true;
  playing: boolean;

  ngOnInit(): void {
    this.audioService
      .getState()
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((state) => {
        this.song = state.song;
        this.lyric = state.lyric;
        this.currentLyric = state.currentLyric;
        this.playing = state.playing;
      });
  }
  ngAfterViewInit(): void {
    setInterval(() => {
      if (this.currentLyric != -1 && this.playing) {
        const currentActive = (<HTMLElement>(
          this.elem.nativeElement
        )).querySelector('.current');

        currentActive.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 500);
  }
}
