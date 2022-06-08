import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeWhile } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { ManagerArtistsStore } from '../manager-artists/manager-artists.store';
import { ManagerSongsStore } from '../manager-songs/manager-songs.store';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss'],
  providers: [ManagerSongsStore, ManagerArtistsStore]
})
export class ConfirmDeleteComponent implements OnInit, OnDestroy {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { song: Song, artist: Artist},
    private songStore: ManagerSongsStore,
    private artistStore: ManagerArtistsStore,
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>) { }
  componentActive = true;
  ngOnInit(): void {
    if(this.data.song) {
      this.songStore.deleteSongStatus$.pipe(takeWhile(() => this.componentActive)).subscribe(
        (deleteSongStatus) => {
          switch(deleteSongStatus) {
            case ApiRequestStatus.Success:
              this.dialogRef.close(true);
              break;
            case ApiRequestStatus.Fail:
              this.dialogRef.close(false);
              break;
            case ApiRequestStatus.Requesting:
              break;
          }
        }
      );
    }
    if(this.data.artist) {
      this.artistStore.deleteArtistStatus$.pipe(takeWhile(() => this.componentActive)).subscribe(
        (deleteArtistStatus) => {
          switch(deleteArtistStatus) {
            case ApiRequestStatus.Success:
              this.dialogRef.close(true);
              break;
            case ApiRequestStatus.Fail:
              this.dialogRef.close(false);
              break;
            case ApiRequestStatus.Requesting:
              break;
          }
        }
      );
    }
    
  }

  ngOnDestroy(): void {
      this.componentActive = false;
  }
  
  confirm()
  {
    if(this.data.song) {
      this.songStore.deleteSongEffect(this.data.song.songId);
    }
    if(this.data.artist) {
      this.artistStore.deleteArtistEffect(this.data.artist.artistId);
    }
  }

}
