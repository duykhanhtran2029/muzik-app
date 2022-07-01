import { AfterViewInit, Component, Inject, OnDestroy, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, ReplaySubject, take, takeWhile } from 'rxjs';
import { AzureBlobStorageService } from 'src/app/music-player/services/azure-storage.service';
import { Song } from 'src/app/interfaces/song.interface';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { environment } from 'src/environments/environment';
import { ManagerSongsStore } from '../manager-songs.store';
import { cloneDeep } from 'lodash';
import { Artist } from 'src/app/interfaces/artist.interface';
import { ManagerArtistsStore } from '../../manager-artists/manager-artists.store';
import { UntypedFormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { UtilService } from 'src/app/music-player/services/utils.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

export type fileType = 'Thumbnail' | 'Audio' | 'Beat' | 'Lyric' | 'Karaoke';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss'],
  providers: [ManagerSongsStore, ManagerArtistsStore]
})
export class AddSongComponent implements OnInit, OnDestroy, AfterViewInit {
  loading = false;
  song: Song = {} as Song;
  formData: FormData;
  imgSrc: string;
  artists: Artist[];
  formControl = new UntypedFormControl();
  formFilterControl = new UntypedFormControl();
  canCreate = false;

  storageURL = '';
  thumbnail = <File>{};
  audio = <File>{};
  beat = <File>{};
  lyric = <File>{};
  karaoke = <File>{};

  IMAGES_CONTAINER = environment.AZURE_STORAGE_CONFIG.IMAGES_CONTAINER;
  SONGS_CONTAINER = environment.AZURE_STORAGE_CONFIG.SONGS_CONTAINER;
  BEATS_CONTAINER = environment.AZURE_STORAGE_CONFIG.BEATS_CONTAINER;
  LYRICS_CONTAINER = environment.AZURE_STORAGE_CONFIG.LYRICS_CONTAINER;

  IMAGES_SAS = environment.AZURE_STORAGE_CONFIG.IMAGES_SAS;
  SONGS_SAS = environment.AZURE_STORAGE_CONFIG.SONGS_SAS;
  BEATS_SAS = environment.AZURE_STORAGE_CONFIG.BEATS_SAS;
  LYRICS_SAS = environment.AZURE_STORAGE_CONFIG.LYRICS_SAS;
  componentActive = true;
  filteredArtists: ReplaySubject<Artist[]> = new ReplaySubject<Artist[]>(1);
  image: SafeStyle;
  @ViewChild('select') select: MatSelect;
  constructor(
    private azureStorageService: AzureBlobStorageService,
    private componentStore: ManagerSongsStore,
    private artistStore: ManagerArtistsStore,
    private utilService: UtilService,
    private dialogRef: MatDialogRef<AddSongComponent>,
    private sanitizer: DomSanitizer) { }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.song.songId = this.utilService.newID();
    this.azureStorageService.download(
      'blobs', 
      'sp=r&st=2022-06-08T03:47:04Z&se=2025-06-08T11:47:04Z&spr=https&sv=2020-08-04&sr=c&sig=5Gv5NW5pidv0JjltwPcXD0unpzpS5Q2%2BjWmcMa%2F5BXE%3D',
      'e2f3da512dcd104613f3b4151ce67438.jpg', (blob: Blob) => {
      var url = URL.createObjectURL(blob);
      console.log(blob);
      console.log(url);
    });
    this.song.thumbnail = new URL('https://muzik.blob.core.windows.net/images/shazam.png');
    this.imgSrc = this.song.thumbnail.toString();
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.componentStore.createSongStatus$.pipe(takeWhile(() => this.componentActive)).subscribe(
      (createSongStatus) => {
        switch (createSongStatus) {
          case ApiRequestStatus.Success:
            this.dialogRef.close({ result: true, song: this.song });
            break;
          case ApiRequestStatus.Fail:
            this.dialogRef.close(false);
            break;
          case ApiRequestStatus.Requesting:
            break;
        }
      }
    );
    this.artistStore.artists$.pipe(takeWhile(() => this.componentActive)).subscribe(
      (artists) => {
        this.artists = artists;
        this.filteredArtists.next(artists.slice());
      }
    );
    this.artistStore.getArtistsEffect();
    this.formFilterControl.valueChanges.pipe(takeWhile(() => this.componentActive)).subscribe(() => {
        this.filterArtists();
    });
  }
  ngAfterViewInit() {
    this.setInitialValue();
  }
  save() {
    this.loading = true;
    const fileName = `S-${this.song.songId}-${new Date().getTime()}`;
    if (this.thumbnail.name) {
      this.azureStorageService.upload(this.IMAGES_CONTAINER, this.IMAGES_SAS, this.thumbnail, fileName + '.png', () => { });
      this.song.thumbnail = new URL(`${this.storageURL}/${this.IMAGES_CONTAINER}/${fileName}.png`);
    }

    if (this.audio.name) {
      this.azureStorageService.upload(this.SONGS_CONTAINER, this.SONGS_SAS, this.audio, fileName + '.mp3', () => { });
      this.song.link = new URL(`${this.storageURL}/${this.SONGS_CONTAINER}/${fileName}.mp3`);
    }

    if (this.beat.name) {
      this.azureStorageService.upload(this.BEATS_CONTAINER, this.BEATS_SAS, this.beat, fileName + '.m4a', () => { });
      this.song.linkBeat = new URL(`${this.storageURL}/${this.BEATS_CONTAINER}/${fileName}.m4a`);
    }

    if (this.lyric.name && this.karaoke.name) {
      this.azureStorageService.upload(this.LYRICS_CONTAINER, this.LYRICS_SAS, this.lyric, fileName + '.lrc', () => { });
      this.azureStorageService.upload(this.LYRICS_CONTAINER, this.LYRICS_SAS, this.lyric, fileName + '.txt', () => { });
      this.song.linkLyric = new URL(`${this.storageURL}/${this.LYRICS_CONTAINER}/${fileName}.lrc`);
    }
    this.song.artists = this.formControl.value;
    this.song.artistsName = this.formControl.value.map(a => a.artistName).join(', ');
    this.componentStore.createSongEffect(this.song);
  }

  cancel() {
    this.dialogRef.close(undefined);
  }

  setFile(e: Event, fileType: fileType = 'Thumbnail') {
    const files = (e.target as HTMLInputElement).files;
    if (files.length === 0)
      return;

    if (files[0]) {
      switch (fileType) {
        case 'Thumbnail':
          this.thumbnail = files[0];
          const reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload = _event => this.imgSrc = reader.result.toString();
          break;
        case 'Audio':
          this.audio = files[0];
          break;
        case 'Beat':
          this.beat = files[0];
          break;
        case 'Lyric':
          this.lyric = files[0];
          break;
        case 'Karaoke':
          this.karaoke = files[0];
          break;
      }

    }
  }

  setInitialValue() {
    this.filteredArtists
      .pipe(take(1), takeWhile(() => this.componentActive))
      .subscribe(() => {
        this.select.compareWith = (a: Artist, b: Artist) => a && b && a.artistId === b.artistId;
      });
  }

  filterArtists() {
    if (!this.artists) {
      return;
    }
    let search = this.formFilterControl.value;
    if (!search) {
      this.filteredArtists.next(this.artists.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredArtists.next(
      this.artists.filter(a => a.artistName.toLowerCase().indexOf(search) > -1)
    );
  }

}

