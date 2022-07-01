import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { MusicPlayerPlaylistService } from 'src/app/music-player/services/music-player.playlist.service';
import { MusicPlayerSongService } from 'src/app/music-player/services/music-player.song.service';
import { AudioPlayerService } from '../../../services/audio-player.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './my-playlist.html',
  styleUrls: ['./my-playlist.scss'],
})
export class MyPlaylistComponent implements OnInit {
  @Input() playlist: Playlist;
  constructor(
    private _router: Router,
    public audioService: AudioPlayerService,
    private songService: MusicPlayerSongService
  ) {}
  ngOnInit(): void {}

  openPlaylist(playlistId: string) {
    this._router.navigate(['/app/playlist', playlistId]);
  }

  streamPlaylist() {
    this.songService
      .getSongFromPlaylist(this.playlist.playlistId)
      .subscribe((res) => {
        this.audioService.playSongs(res);
      });
  }
}
