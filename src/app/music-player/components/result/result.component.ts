import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeWhile } from 'rxjs';
import {
  FingerPrintingResult, MatchedSong,
} from 'src/app/interfaces/fingerPrintingResult.interface';
import { AppState } from 'src/app/store/reducers';
import { getFingerPrintingResult } from '../../store/selectors/songs.selector';
import { MatDialogRef } from '@angular/material/dialog';
import { SongDetailComponent } from '../manager/manager-songs/song-detail/song-detail.component';
import { ResultStore } from './result.store';
import { cloneDeep } from 'lodash';


@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  providers: [ResultStore]
})
export class ResultComponent implements OnInit, OnDestroy {
  fingerPrintingResult: FingerPrintingResult;
  matchedSongs: MatchedSong[];
  detailDialogRef: MatDialogRef<SongDetailComponent>;
  loaded: boolean;
  componentActive = true;
  constructor(
    private store: Store<AppState>,
    private componentStore: ResultStore) { }

  ngOnInit(): void {
    this.componentStore.songs$.pipe(takeWhile(() => this.componentActive)).subscribe((songs) => {
      songs.forEach(s => {
        const matchedSong = this.matchedSongs.find(ms => ms.song.songId === s.songId);
        if(matchedSong) {
          matchedSong.song.playableSong = s;
          this.loaded = true;
        }
      })
    });
    this.store.select(getFingerPrintingResult).subscribe((res) => {
      if (res && this.fingerPrintingResult !== res) {
        this.fingerPrintingResult = res;
        if (this.fingerPrintingResult.matchedSongs) {
          this.matchedSongs = cloneDeep(this.fingerPrintingResult.matchedSongs);
          this.componentStore.getSongsEffect(this.fingerPrintingResult.matchedSongs.map(s => s.song.songId));
        }
      }
    });
  }
  ngOnDestroy(): void {
      this.componentActive = false;
  }
}
