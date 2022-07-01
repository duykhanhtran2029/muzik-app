import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeWhile } from 'rxjs';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { AzureBlobStorageService } from 'src/app/music-player/services/azure-storage.service';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail-playlist',
  templateUrl: './detail-information.component.html',
  styleUrls: ['./detail-information.component.scss'],
})
export class DetailPlaylistInformationComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private azureStorageService: AzureBlobStorageService,
    private dialogRef: MatDialogRef<DetailPlaylistInformationComponent>
  ) {}
  imgSrc: string;
  playlistName: string;
  sortDescription: string;
  isPrivate: boolean;
  thumbnail = <File>{};
  loading = false;
  playlist: Playlist = {} as Playlist;
  storageURL = '';
  componentActive = true;
  IMAGES_CONTAINER = environment.AZURE_STORAGE_CONFIG.IMAGES_CONTAINER;

  IMAGES_SAS = environment.AZURE_STORAGE_CONFIG.IMAGES_SAS;

  ngOnInit(): void {
    this.imgSrc = this.data.playlist.thumbnail.toString();
    this.playlist = this.data.playlist;
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.data.store.getUpdatePlaylistStatus$
      .pipe(takeWhile(() => this.componentActive))
      .subscribe((updatePlaylistStatus) => {
        switch (updatePlaylistStatus) {
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
    this.data.store.updatePlaylistEffect(this.playlist);
  }
}
