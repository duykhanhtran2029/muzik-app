import { Component, Input, OnInit } from '@angular/core';
import { Song } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from '../../services/audio-player.service';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.scss'],
})
export class QueueComponent {
  constructor(private audioService: AudioPlayerService) {}

  @Input() queue: Song[];
  @Input() recommendedSongs: Song[];
  state$ = this.audioService.getState();

  updateRecommend() {
    this.audioService.updateRecommend();
  }
}
