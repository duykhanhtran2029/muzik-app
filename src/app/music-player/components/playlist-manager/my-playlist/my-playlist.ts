import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist.interface';

@Component({
  selector: 'app-playlist',
  templateUrl: './my-playlist.html',
  styleUrls: ['./my-playlist.scss'],
})
export class MyPlaylistComponent implements OnInit {
  @Input() playlist: Playlist;
  constructor(private _router: Router) {}
  ngOnInit(): void {}

  openPlaylist(playlistId: string) {
    this._router.navigate(['/app/playlist', playlistId]);
  }
}
