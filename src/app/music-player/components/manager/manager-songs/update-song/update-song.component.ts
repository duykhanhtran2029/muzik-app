import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, takeWhile} from 'rxjs';
import { AzureBlobStorageService } from 'src/app/music-player/services/azure-storage.service';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';
import { ManagerSongsStore } from '../manager-songs.store';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-update-song',
  templateUrl: './update-song.component.html',
  styleUrls: ['./update-song.component.scss'],
  providers: [ManagerSongsStore]
})
export class UpdateSongComponent implements OnInit, OnDestroy {
  loading = false;
  song: Song;
  formData: FormData;
  imgSrc: string;
  updateSongStatus$: Observable<ApiRequestStatus>;
  
  storageURL = '';
  thumbnail = <File>{};
  audio = <File>{};
  fileName = '';

  imagesContainer = environment.azureStorage.imagesContainer;
  songsContainer = environment.azureStorage.songsContainer;
  imagesSAS = environment.azureStorage.imagesSAS;
  songsSAS = environment.azureStorage.songsSAS;
  componentActive = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private azureStorageService: AzureBlobStorageService,
    private componentStore: ManagerSongsStore,
    private dialogRef: MatDialogRef<UpdateSongComponent>) { }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.song = cloneDeep(this.data);
    this.imgSrc = this.song.thumbnail.toString();
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.componentStore.updateSongStatus$.pipe(takeWhile(() => this.componentActive)).subscribe(
      (updateSongStatus) => {
        switch(updateSongStatus) {
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
  setFilename(files: any) {
    if (files.length === 0)
      return;

    if (files[0]) {
      this.thumbnail = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = _event => this.imgSrc = reader.result.toString();
    } 
  }

  save() {
    if (!(this.song.songId && this.audio.name))
      return;
    this.loading = true;
    if (this.thumbnail.name) {
      this.song.thumbnail = new URL(`${this.storageURL}/${this.imagesContainer}/${this.song.songId}`);
      this.azureStorageService.delete(this.imagesContainer, this.imagesSAS, this.song.songId, () => { });
      this.azureStorageService.upload(this.imagesContainer, this.imagesSAS, this.thumbnail, this.song.songId, () => { });
    }

    if (this.audio && this.fileName.endsWith('.mp3')) {
      this.song.link = new URL(`${this.storageURL}/${this.songsContainer}/${this.song.songId}.mp3`);
      this.azureStorageService.delete(this.songsContainer, this.songsSAS, this.song.songId, () => { });
      this.azureStorageService.upload(this.songsContainer, this.songsSAS, this.audio, this.song.songId, () => {});
    }
   
    this.componentStore.updateSongEffect(this.song);
  }

  cancel()
  {
    this.dialogRef.close(undefined);
  }

  setAudio(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files.length === 0)
      return;

    if (files[0]) {
      this.audio = files[0];
      this.fileName = this.audio.name;
    }
  }

}

