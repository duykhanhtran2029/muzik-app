import { Component, OnInit, Input } from '@angular/core';
import { Song } from 'src/app/interfaces/song.interface';

@Component({
  selector: 'app-rounded-song',
  templateUrl: './rounded-song.component.html',
  styleUrls: ['./rounded-song.component.scss']
})
export class RoundedSongComponent implements OnInit {
  @Input() song: Song;
  constructor() { }

  ngOnInit(): void {
  }

}
