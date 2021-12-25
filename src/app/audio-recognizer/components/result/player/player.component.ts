import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Song } from 'src/app/interfaces/song.interface';
@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private dialogRef: MatDialogRef<PlayerComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
}
