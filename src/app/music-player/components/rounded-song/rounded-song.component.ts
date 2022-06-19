import { Component, OnInit, Input } from '@angular/core';
import { Song } from 'src/app/interfaces/song.interface';
import { AudioPlayerService } from '../../services/audio-player.service';

@Component({
  selector: 'app-rounded-song',
  templateUrl: './rounded-song.component.html',
  styleUrls: ['./rounded-song.component.scss'],
})
export class RoundedSongComponent implements OnInit {
  @Input() song: Song;
  constructor(public audioService: AudioPlayerService) {}

  ngOnInit(): void {}

  addToQueue() {
    this.audioService.addToQueue(this.song);
  }

}
