import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Actions, ofType } from '@ngrx/effects';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { map, Observable, Subscription, tap } from 'rxjs';
import { AzureBlobStorageService } from 'src/app/audio-recognizer/services/azureStorage.service';
import { SongService } from 'src/app/audio-recognizer/services/songs.service';
import { cleanState, createSong, updateSong, updateSongSuccess } from 'src/app/audio-recognizer/store/actions/songs.actions';
import { getCreateSongStatus, getUpdateSongStatus } from 'src/app/audio-recognizer/store/selectors/songs.selector';
import { Song } from 'src/app/interfaces/song.interface';
import { AppState } from 'src/app/store/reducers';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})
export class AddSongComponent implements OnInit, OnDestroy {
  loading = false;
  song = <Song>{};
  storageURL = '';
  thumbnail = <File>{};
  audio = <File>{};
  fileName = '';
  subcripstion = new Subscription();

  imagesContainer = environment.azureStorage.imagesContainer;
  songsContainer = environment.azureStorage.songsContainer;
  imagesSAS = environment.azureStorage.imagesSAS;
  songsSAS = environment.azureStorage.songsSAS;
  constructor(
    private azureStorageService: AzureBlobStorageService,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<AddSongComponent>) { }
    
  ngOnDestroy(): void {
    this.store.dispatch(cleanState());
    this.subcripstion.unsubscribe();
  }

  ngOnInit(): void {
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.song.thumbnail = new URL(`${this.storageURL}/images/placeholder.png`);
    this.subcripstion = this.store.select(getCreateSongStatus).subscribe(
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

  setThumbnail(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (files.length === 0)
      return;

    if (files[0]) {
      this.thumbnail = files[0];
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = _event => this.song.thumbnail = new URL(reader.result.toString());
    } 
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


  save() {
    if (!(this.song.title && this.song.artist && this.audio.name))
      return;
    this.loading = true;
    this.song.name = this.newUid();
    if(this.thumbnail.name) {
      const fileName = `${this.song.name}.${this.thumbnail.name.split('.').pop()}`;
      this.song.thumbnail = new URL(`${this.storageURL}/${this.imagesContainer}/${fileName}`);
      this.azureStorageService.upload(this.imagesContainer, this.imagesSAS, this.thumbnail, fileName, () => {});
    }
    const fileName = `${this.song.name}.${this.audio.name.split('.').pop()}`;
    this.azureStorageService.upload(
      this.songsContainer, this.songsSAS, this.audio, fileName,
      () => {
        this.song.link = new URL(`${this.storageURL}/${this.songsContainer}/${fileName}`);
        this.store.dispatch(createSong({ song: this.song }));
      });

    // const tmpName = this.fileName.toLowerCase();
    // if (this.song.title && this.song.artist && (tmpName.endsWith('.mp3'))) {
    //   this.song.link = new URL(`https://shazam.blob.core.windows.net/songs/${this.}`);
    //   this.formData.append("thumbnail", this.thumbnail);
    //   this.store.dispatch(createSong({ song: this.song, formData: this.formData }));
    // }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  newUid () {
    return Date.now().toString(36) + Math.random().toString(36);
  }

}
