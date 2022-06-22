import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeWhile } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { AzureBlobStorageService } from 'src/app/music-player/services/azure-storage.service';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';
import { UpdateSongComponent } from '../../manager-songs/update-song/update-song.component';
import { cloneDeep } from 'lodash';
import { ManagerArtistsStore } from '../manager-artists.store';

@Component({
  selector: 'app-update-artist',
  templateUrl: './update-artist.component.html',
  styleUrls: ['./update-artist.component.scss'],
  providers: [ManagerArtistsStore]
})
export class UpdateArtistComponent implements OnInit {

  loading = false;
  artist: Artist;
  formData: FormData;
  imgSrc: string;

  storageURL = '';
  thumbnail = <File>{};

  IMAGES_CONTAINER = environment.AZURE_STORAGE_CONFIG.IMAGES_CONTAINER;
  IMAGES_SAS = environment.AZURE_STORAGE_CONFIG.IMAGES_SAS;
  componentActive = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Artist,
    private azureStorageService: AzureBlobStorageService,
    private componentStore: ManagerArtistsStore,
    private dialogRef: MatDialogRef<UpdateSongComponent>) { }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.artist = cloneDeep(this.data);
    this.imgSrc = this.artist.thumbnail.toString();
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.componentStore.updateArtistStatus$.pipe(takeWhile(() => this.componentActive)).subscribe(
      (updateArtistStatus) => {
        switch (updateArtistStatus) {
          case ApiRequestStatus.Success:
            this.dialogRef.close({result: true, artist: this.artist});
            break;
          case ApiRequestStatus.Fail:
            this.dialogRef.close(false);
            break;
          case ApiRequestStatus.Requesting:
            this.loading = true;
            break;
        }
      }
    );
  }
  setFilename(files: any, size: string) {
    if (files.length === 0)
      return;

    if (files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      this.thumbnail = files[0];
      reader.onload = _event => this.imgSrc = reader.result.toString();
    }
  }

  save() {
    if (this.thumbnail.name) {
      const thumbnailName = `A-${this.artist.artistId}-${new Date().getTime()}.png`;
      this.azureStorageService.delete(this.IMAGES_CONTAINER, this.IMAGES_SAS, this.artist.thumbnail.toString().split('/').pop(), () => { });
      this.azureStorageService.upload(this.IMAGES_CONTAINER, this.IMAGES_SAS, this.thumbnail, thumbnailName, () => {
        this.artist.thumbnail = new URL(`${this.storageURL}/${this.IMAGES_CONTAINER}/${thumbnailName}`);
      });
    }
    this.componentStore.updateArtistEffect(this.artist);
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

}
