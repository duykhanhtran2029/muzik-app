import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Song } from 'src/app/interfaces/song.interface';

@Component({
  selector: 'app-update-song',
  templateUrl: './update-song.component.html',
  styleUrls: ['./update-song.component.scss']
})
export class UpdateSongComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private dialogRef: MatDialogRef<UpdateSongComponent>) { }

  ngOnInit(): void {
  }

}
