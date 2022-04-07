import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take, tap } from 'rxjs';
import {
  FingerPrintingResult,
  MatchedSong,
} from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { AppState } from 'src/app/store/reducers';
import { getFingerPrintingResult } from '../../store/selectors/songs.selector';
import { PlayerComponent } from './player/player.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

const songInfo = [
  {
    id: 1,
    title: 'I See Fire (From "The Hobbit - The Desolation Of Smaug")',
    artist: 'Ed Sheeran',
    name: 'ZWAIDIWF',
    link: 'https://shazam.blob.core.windows.net/songs/ZWAIDIWF.mp3',
    thumbnail:
      'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/4/2/0/5/42059987c8424030a4ab08b13b9ed753.jpg',
    linkZingmp3:
      '/bai-hat/Everything-Has-Changed-Remix-Taylor-Swift-Ed-Sheeran/ZO9F0I6W.html',
    linkMV: null,
    score: 0.55,
  },
  {
    id: 2,
    title: 'Love Me Like You Do (From "Fifty Shades Of Grey")',
    artist: 'Ellie Goulding',
    name: 'ZWAW0CCO',
    link: 'https://shazam.blob.core.windows.net/songs/ZWAW0CCO.mp3',
    thumbnail:
      'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/c/5/0/7/c507700b6ea32dc39908933e39a27774.jpg',
    linkZingmp3:
      '/bai-hat/Love-Me-Like-You-Do-From-Fifty-Shades-Of-Grey-Ellie-Goulding/ZWAW0CCO.html',
    linkMV: null,
    score: 0.4,
  },
  {
    id: 3,
    title: 'Missing You',
    artist: 'Phương Ly, TINLE',
    name: 'ZWC6DUFW',
    link: 'https://shazam.blob.core.windows.net/songs/ZWC6DUFW.mp3',
    thumbnail:
      'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/f/2/5/2/f252f7da121709f0243729efe85ed7d9.jpg',
    linkZingmp3: '/bai-hat/Missing-You-Phuong-Ly-TINLE/ZWC6DUFW.html',
    linkMV: '/video-clip/Missing-You-Phuong-Ly-TINLE/ZWC6DUFW.html',
    score: 0.6,
  },
  {
    id: 4,
    title: 'Vì Sao',
    artist: 'Khởi My, Hoàng Rapper',
    name: 'ZWZA9OZ0',
    link: 'https://shazam.blob.core.windows.net/songs/ZWZA9OZ0.mp3',
    thumbnail:
      'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/covers/8/6/8613a14b4d0d152ba9dd445c801b1ea5_1293165362.jpg',
    linkZingmp3: '/bai-hat/Vi-Sao-Khoi-My-Hoang-Rapper/ZWZA9OZ0.html',
    linkMV: null,
    score: 0.23,
  },
];
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  fingerPrintingResult: FingerPrintingResult;

  listSong: MatchedSong[] = [];
  fingerPrintingResult$: Observable<FingerPrintingResult>;
  currentActiveSong: number;
  currentSong: MatchedSong;
  detailDialogRef: MatDialogRef<PlayerComponent>;
  loaded: boolean;
  constructor(private store: Store<AppState>, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store
      .select(getFingerPrintingResult)
      .subscribe((res) => (this.fingerPrintingResult = res));
    console.log(this.fingerPrintingResult);

    if (this.fingerPrintingResult.matchedSongs) {
      this.fingerPrintingResult.matchedSongs.forEach((index: Object) => {
        const song: Song = {
          id: index['song'].id,
          name: index['song'].name,
          title: index['song'].title,
          artist: index['song'].artist,
          link: index['song'].link,
          linkZingMp3: index['song'].linkZingMp3,
          linkMV: index['song'].linkMV,
          thumbnail: index['song'].thumbnail,
        };
        const matchedSong: MatchedSong = {
          song: song,
          score: index['score'],
        };

        this.listSong.push(matchedSong);
      });

      if (this.listSong.length > 0) this.loaded = true;
      else this.loaded = false;

      this.currentSong = this.listSong[0];
    }
  }
  onActivated(id: number) {
    this.currentActiveSong = id;
    this.listSong.forEach((matchedSong) => {
      if (matchedSong.song.id == id) this.currentSong = matchedSong;
    });
  }
  openDetail(song: Song) {
    this.detailDialogRef = this.dialog.open(PlayerComponent, {
      data: song,
      panelClass: 'transparent-dialog',
    });
  }
}
