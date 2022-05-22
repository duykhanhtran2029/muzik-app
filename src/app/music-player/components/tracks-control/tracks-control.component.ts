import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { Song, StreamState } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from '../../services/audio-player.service';

@Component({
  selector: 'app-tracks-control',
  templateUrl: './tracks-control.component.html',
  styleUrls: ['./tracks-control.component.scss']
})
export class TracksControlComponent implements OnInit, OnDestroy {
  isQueueOpened = false;
  state: StreamState;
  componentActive = true;

  constructor(
    private audioService: AudioPlayerService
  ) { }

  ngOnInit(): void {
    this.audioService.getState().pipe(takeWhile(() => this.componentActive)).subscribe(state => this.state = state);
    if(!this.state.duration && this.state.song) {
      this.audioService.playStream(this.state.song);
    }
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  toggleQueue() {
    this.isQueueOpened = !this.isQueueOpened;
  }

  onSliderChange(change) {
    this.audioService.seekTo(change.value);
  }

  onVolumeChange(change) {
    this.audioService.setVolumeTo(change.value);
  }

  togglePlay() {
    this.state.playing ? this.audioService.pause() : this.audioService.play();
  }

  toggleMute() {
    this.audioService.toggleMute();
  }

  toggleRepeat() {
    this.audioService.toggleRepeat();
  }

  toggleShuffle() {
    this.audioService.toggleShuffle();
  }

  next() {
    this.audioService.next();
  }

  prev() {
    this.audioService.prev();
  }

}
