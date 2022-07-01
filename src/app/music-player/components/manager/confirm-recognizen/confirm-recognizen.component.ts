import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeWhile } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { ManagerSongsStore } from '../manager-songs/manager-songs.store';

@Component({
  selector: 'app-confirm-recognizen',
  templateUrl: './confirm-recognizen.component.html',
  styleUrls: ['./confirm-recognizen.component.scss'],
  providers: [ManagerSongsStore]
})
export class ConfirmRecognizenComponent implements OnInit, OnDestroy {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private songStore: ManagerSongsStore,
    private dialogRef: MatDialogRef<ConfirmRecognizenComponent>) { }

  componentActive = true;
  isRequesting = false;
  ngOnInit(): void {
    this.songStore.toggleSongRecognizableStatus2$.pipe(takeWhile(() => this.componentActive)).subscribe(
      (toggleSongRecognizableStatus2) => {
        switch (toggleSongRecognizableStatus2) {
          case ApiRequestStatus.Success:
            this.dialogRef.close(true);
            break;
          case ApiRequestStatus.Fail:
            this.dialogRef.close(false);
            break;
          case ApiRequestStatus.Requesting:
            this.isRequesting = true;
            break;
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  confirm() {
    this.songStore.toggleSongRecognizableEffect1({ songId: this.data.songId, isRecognizable: !this.data.isRecognizable });
    this.songStore.toggleSongRecognizableEffect2({ songId: this.data.songId, isRecognizable: !this.data.isRecognizable });
  }

}
