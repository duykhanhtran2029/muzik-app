import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Song } from 'src/app/interfaces/song.interface';

@Component({
  selector: 'app-top-song',
  templateUrl: './top-song.component.html',
  styleUrls: ['./top-song.component.scss']
})
export class TopSongComponent implements OnInit {
  @Input() index: number;
  @Input() song: Song;
  duration: string;
  private audioObj = new Audio();
  constructor() { }

  ngOnInit(): void {
    this.audioObj.src = this.song.link.toString();
    this.audioObj.addEventListener(
      'loadedmetadata',
      () => {
        this.duration = moment.utc(this.audioObj.duration * 1000).format('mm:ss');
      }
    );
  }

}
