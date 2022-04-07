import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription, tap } from 'rxjs';
import { AzureBlobStorageService } from 'src/app/music-player/services/azureStorage.service';
import { cleanState, updateSong } from 'src/app/music-player/store/actions/songs.actions';
import { getUpdateSongStatus } from 'src/app/music-player/store/selectors/songs.selector';
import { Song } from 'src/app/interfaces/song.interface';
import { AppState } from 'src/app/store/reducers';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-song',
  templateUrl: './update-song.component.html',
  styleUrls: ['./update-song.component.scss']
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

  subcripstion = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private azureStorageService: AzureBlobStorageService,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<UpdateSongComponent>) { }

  ngOnDestroy(): void {
    this.store.dispatch(cleanState());
    this.subcripstion.unsubscribe();
  }

  ngOnInit(): void {
    this.song = { ...this.data};
    this.imgSrc = this.song.thumbnail.toString();
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.subcripstion = this.store.select(getUpdateSongStatus).subscribe(
      ((status: ApiRequestStatus) => {
        console.log(status)
        switch (status) {
          case ApiRequestStatus.Success:
            this.dialogRef.close(true);
            break;
          case ApiRequestStatus.Fail:
            this.dialogRef.close(false);
            break;
          default:
            break;
        }
    }));
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
    this.loading = true;
    if (this.thumbnail.name) {
      const fileName = `${this.song.name}.${this.thumbnail.name.split('.').pop()}`;
      this.song.thumbnail = new URL(`${this.storageURL}/${this.imagesContainer}/${fileName}`);
      this.azureStorageService.upload(this.imagesContainer, this.imagesSAS, this.thumbnail, fileName, () => { });
    }
    this.store.dispatch(updateSong({ song: this.song}));
  }
  cancel()
  {
    this.dialogRef.close();
  }

}
