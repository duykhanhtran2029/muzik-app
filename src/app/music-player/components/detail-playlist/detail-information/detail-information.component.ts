import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Playlist } from 'src/app/interfaces/playlist.interface';

@Component({
  selector: 'app-detail-playlist',
  templateUrl: './detail-information.component.html',
  styleUrls: ['./detail-information.component.scss'],
})
export class DetailPlaylistInformationComponent implements OnInit, OnDestroy {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Playlist) {}
  imgSrc: string;
  playlistName: string;
  sortDescription: string;
  isPrivate: boolean;
  thumbnail = <File>{};

  ngOnInit(): void {
    this.imgSrc = this.data.thumbnail.toString();
    this.playlistName = this.data.playlistName;
    this.sortDescription = this.data.sortDescription;
    this.isPrivate = this.isPrivate;
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
