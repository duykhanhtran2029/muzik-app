import { Component, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { Playlist } from 'src/app/interfaces/playlist.interface';

@Component({
  selector: 'app-create-new-playlist',
  templateUrl: './create-new-playlist.component.html',
  styleUrls: ['./create-new-playlist.component.scss'],
})
export class CreateNewPlaylistComponent implements OnInit, OnDestroy {
  constructor() {}
  imgSrc: string;
  playlistName: string;
  sortDescription: string;
  isPrivate: boolean;
  thumbnail = <File>{};

  ngOnInit(): void {
    this.imgSrc = 'https://shazam.blob.core.windows.net/images/placeholder.png';
  }
  ngOnDestroy(): void {}

  setFile(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files.length === 0) return;
    this.thumbnail = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => (this.imgSrc = reader.result.toString());
  }
}
