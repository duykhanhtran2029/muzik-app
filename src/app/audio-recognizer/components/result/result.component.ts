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
    this.fingerPrintingResult.matchedSongs.forEach((index: Object) => {
      const song: Song = {
        id: index['song'].Id,
        name: index['song'].Name,
        title: index['song'].Title,
        artist: index['song'].Artist,
        link: index['song'].Link,
        linkZingMp3: index['song'].LinkZingMp3,
        linkMV: index['song'].LinkMV,
        thumbnail: index['song'].Thumbnail,
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
