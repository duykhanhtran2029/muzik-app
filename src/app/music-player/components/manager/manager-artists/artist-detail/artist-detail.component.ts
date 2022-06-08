import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ArtistStore } from '../../../artist/artist.store';

@Component({
  selector: 'app-artist-detail',
  templateUrl: './artist-detail.component.html',
  styleUrls: ['./artist-detail.component.scss'],
  providers: [ArtistStore]
})
export class ArtistDetailComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Artist,
    private dialogRef: MatDialogRef<ArtistDetailComponent>,
    private componentStore: ArtistStore) { }
  songs$ = this.componentStore.songs$;
  ngOnInit(): void {
    this.componentStore.getSongsEffect(this.data.artistId);
  }

}
