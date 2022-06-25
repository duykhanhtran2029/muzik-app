import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { takeWhile } from 'rxjs';
import { Artist, RawArtist } from 'src/app/interfaces/artist.interface';
import { AzureBlobStorageService } from 'src/app/music-player/services/azure-storage.service';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';
import { UpdateSongComponent } from '../../manager-songs/update-song/update-song.component';
import { cloneDeep } from 'lodash';
import { ManagerArtistsStore } from '../manager-artists.store';
import { UtilService } from 'src/app/music-player/services/utils.service';

@Component({
  selector: 'app-add-artist',
  templateUrl: './add-artist.component.html',
  styleUrls: ['./add-artist.component.scss'],
  providers: [ManagerArtistsStore]
})
export class AddArtistComponent implements OnInit {

  loading = false;
  artist: RawArtist ={
    artistId: this.idService.newID(true),
    artistName: '',
    thumbnail: new URL('https://shazam.blob.core.windows.net/images/artist_default.png'),
    isDeleted: false
  };
  formData: FormData;
  imgSrc: string;

  storageURL = '';
  thumbnail = <File>{};

  IMAGES_CONTAINER = environment.AZURE_STORAGE_CONFIG.IMAGES_CONTAINER;
  IMAGES_SAS = environment.AZURE_STORAGE_CONFIG.IMAGES_SAS;
  componentActive = true;

  constructor(
    private azureStorageService: AzureBlobStorageService,
    private componentStore: ManagerArtistsStore,
    private dialogRef: MatDialogRef<UpdateSongComponent>,
    private idService: UtilService) { }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.imgSrc = this.artist.thumbnail.toString();
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.componentStore.createArtistStatus$.pipe(takeWhile(() => this.componentActive)).subscribe(
      (createArtistStatus) => {
        switch (createArtistStatus) {
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
    if (!this.artist.artistName) {
      return;
    }
    this.loading = true;
    if (this.thumbnail.name) {
      const thumbnailName = `A-${this.artist.artistId}-${new Date().getTime()}.png`;
      this.artist.thumbnail = new URL(`${this.storageURL}/${this.IMAGES_CONTAINER}/${thumbnailName}`);
      this.azureStorageService.upload(this.IMAGES_CONTAINER, this.IMAGES_SAS, this.thumbnail, thumbnailName, () => { });
    }
    this.componentStore.createArtistEffect(this.artist);
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

}
