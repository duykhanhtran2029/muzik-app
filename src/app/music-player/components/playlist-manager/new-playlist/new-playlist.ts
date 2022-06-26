import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-new-playlist',
  templateUrl: './new-playlist.html',
  styleUrls: ['./new-playlist.scss'],
})
export class NewPlaylistComponent implements OnInit {
  constructor() {}
  @Output() createPlaylist = new EventEmitter();
  ngOnInit(): void {}

  openCreate(){
    this.createPlaylist.emit();
  }
}
