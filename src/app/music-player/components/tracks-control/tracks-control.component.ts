import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { takeWhile } from 'rxjs';
import { StreamState } from 'src/app/interfaces/song.interface';
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
  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.audioService.getState().pipe(takeWhile(() => this.componentActive)).subscribe(state => this.state = state);
    this.audioService.playStream('https://ia801504.us.archive.org/3/items/EdSheeranPerfectOfficialMusicVideoListenVid.com/Ed_Sheeran_-_Perfect_Official_Music_Video%5BListenVid.com%5D.mp3').subscribe();
    this.audioService.pause();
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

}
