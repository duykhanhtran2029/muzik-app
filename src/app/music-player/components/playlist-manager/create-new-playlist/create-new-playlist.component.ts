import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeStyle } from '@angular/platform-browser';
import { takeWhile } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { AzureBlobStorageService } from 'src/app/music-player/services/azure-storage.service';
import { UtilService } from 'src/app/music-player/services/utils.service';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';
import { PlaylistsStore } from '../playlist-manager.store';

@Component({
  selector: 'app-create-new-playlist',
  templateUrl: './create-new-playlist.component.html',
  styleUrls: ['./create-new-playlist.component.scss'],
})
export class CreateNewPlaylistComponent implements OnInit, OnDestroy {
  constructor(
    private azureStorageService: AzureBlobStorageService,
    private utilService: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: PlaylistsStore,
    private dialogRef: MatDialogRef<CreateNewPlaylistComponent>
  ) {}
  imgSrc: string;
  thumbnail = <File>{};
  loading = false;
  playlist: Playlist = {} as Playlist;
  canCreate = false;
  storageURL = '';
  componentActive = true;

  IMAGES_CONTAINER = environment.AZURE_STORAGE_CONFIG.IMAGES_CONTAINER;

  IMAGES_SAS = environment.AZURE_STORAGE_CONFIG.IMAGES_SAS;

  ngOnInit(): void {
    this.playlist.playlistId = this.utilService.playlistID();
    this.playlist.thumbnail = new URL(
      'https://shazam.blob.core.windows.net/images/placeholder.png'
    );
    this.imgSrc = this.playlist.thumbnail.toString();
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.data.createPlaylistStatus$
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((createSongStatus) => {
        switch (createSongStatus) {
          case ApiRequestStatus.Success:
            this.dialogRef.close({ result: true, playlist: this.playlist });
            break;
          case ApiRequestStatus.Fail:
            this.dialogRef.close(false);
            break;
          case ApiRequestStatus.Requesting:
            break;
        }
      });
  }
  ngOnDestroy(): void {
    this.componentActive = false;
  }

  save() {
    this.loading = true;
    const fileName = `S-${this.playlist.playlistId}-${new Date().getTime()}`;
    if (this.thumbnail.name) {
      this.azureStorageService.upload(
        this.IMAGES_CONTAINER,
        this.IMAGES_SAS,
        this.thumbnail,
        fileName + '.png',
        () => {}
      );
      this.playlist.thumbnail = new URL(
        `${this.storageURL}/${this.IMAGES_CONTAINER}/${fileName}.png`
      );
    }
    this.playlist.userID = 'google-oauth2|114795482044392002727';
    this.data.createPlaylistsEffect(this.playlist);
  }

  setFile(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files.length === 0) return;
    this.thumbnail = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => (this.imgSrc = reader.result.toString());
  }

  setValue(e) {
    if (e.checked) {
      this.playlist.isPrivate = false;
    } else {
      this.playlist.isPrivate = true;
    }
  }
}
