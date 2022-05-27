import { Component, Input, OnInit } from '@angular/core';
import { Song } from 'src/app/interfaces/song.interface';
import {mockSongs} from '../../../../shared/mockSongs';
@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  constructor() { }
  @Input() playlistName: string;
  songs: Song[] = JSON.parse(JSON.stringify(mockSongs));
  ngOnInit(): void {
  }

}
