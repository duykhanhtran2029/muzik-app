import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Song } from 'src/app/interfaces/song.interface';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private dialogRef: MatDialogRef<SongDetailComponent>) { }

  ngOnInit(): void {
    console.log(this.data);
  }

}
