import { AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

export type fileType = 'Thumbnail' | 'Audio' | 'Beat' | 'Lyric' | 'Karaoke';

@Component({
  selector: 'app-update-song',
  templateUrl: './update-song.component.html',
  styleUrls: ['./update-song.component.scss'],
  providers: [ManagerSongsStore, ManagerArtistsStore]
})
export class UpdateSongComponent implements OnInit, OnDestroy, AfterViewInit {
  loading = false;
  song: Song;
  formData: FormData;
  imgSrc: string;
  artists: Artist[];
  formControl = new UntypedFormControl();
  formFilterControl = new UntypedFormControl();

  storageURL = '';
  thumbnail = <File>{};
  audio = <File>{};
  beat = <File>{};
  lyric = <File>{};
  karaoke = <File>{};

  imagesContainer = environment.azureStorage.imagesContainer;
  songsContainer = environment.azureStorage.songsContainer;
  beatsContainer = environment.azureStorage.beatsContainer;
  lyricsContainer = environment.azureStorage.lyricsContainer;

  imagesSAS = environment.azureStorage.imagesSAS;
  songsSAS = environment.azureStorage.songsSAS;
  beatsSAS = environment.azureStorage.beatsSAS;
  lyricsSAS = environment.azureStorage.lyricsSAS;
  componentActive = true;
  filteredArtists: ReplaySubject<Artist[]> = new ReplaySubject<Artist[]>(1);

  @ViewChild('select') select: MatSelect;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private azureStorageService: AzureBlobStorageService,
    private componentStore: ManagerSongsStore,
    private artistStore: ManagerArtistsStore,
    private dialogRef: MatDialogRef<UpdateSongComponent>) { }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.song = cloneDeep(this.data);
    this.formControl.setValue(cloneDeep(this.song.artists));
    this.imgSrc = this.song.thumbnail.toString();
    this.storageURL = this.azureStorageService.baseStorageURL();
    this.componentStore.updateSongStatus$.pipe(takeWhile(() => this.componentActive)).subscribe(
      (updateSongStatus) => {
        switch (updateSongStatus) {
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
      this.azureStorageService.delete(this.imagesContainer, this.imagesSAS, this.song.thumbnail.toString().split('/').pop(), () => { });
      this.azureStorageService.upload(this.imagesContainer, this.imagesSAS, this.thumbnail, fileName + '.png', () => { });
      this.song.thumbnail = new URL(`${this.storageURL}/${this.imagesContainer}/${fileName}.png`);
    }

    if (this.audio.name) {
      this.azureStorageService.delete(this.songsContainer, this.songsSAS, this.song.link.toString().split('/').pop(), () => { });
      this.azureStorageService.upload(this.songsContainer, this.songsSAS, this.audio, fileName + '.mp3', () => { });
      this.song.link = new URL(`${this.storageURL}/${this.songsContainer}/${fileName}.mp3`);
    }

    if (this.beat.name) {
      if(this.song.linkBeat) {
        this.azureStorageService.delete(this.beatsContainer, this.beatsSAS, this.song.linkBeat.toString().split('/').pop(), () => { });
      }
      this.azureStorageService.upload(this.beatsContainer, this.beatsSAS, this.beat, fileName + '.m4a', () => { });
      this.song.linkBeat = new URL(`${this.storageURL}/${this.beatsContainer}/${fileName}.m4a`);
    }

    if (this.lyric.name && this.karaoke.name) {
      if(this.song.linkLyric) {
        this.azureStorageService.delete(this.lyricsContainer, this.lyricsSAS, this.song.linkLyric.toString().split('/').pop(), () => { });
        this.azureStorageService.delete(this.lyricsContainer, this.lyricsSAS, this.song.linkLyric.toString().split('/').pop().replace('.lrc', '.txt'), () => { });
      }
      this.azureStorageService.upload(this.lyricsContainer, this.lyricsSAS, this.lyric, fileName + '.lrc', () => { });
      this.azureStorageService.upload(this.lyricsContainer, this.lyricsSAS, this.lyric, fileName + '.txt', () => { });
      this.song.linkLyric = new URL(`${this.storageURL}/${this.lyricsContainer}/${fileName}.lrc`);
    }
    this.song.artists = this.formControl.value;
    this.song.artistsName = this.formControl.value.map(a => a.artistName).join(', ');
    this.componentStore.updateSongEffect(this.song);
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

