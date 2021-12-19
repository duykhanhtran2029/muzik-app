import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take, tap } from 'rxjs';
import { FingerPrintingResult, MatchedSong } from 'src/app/interfaces/fingerPrintingResult.interface';
import { Song } from 'src/app/interfaces/song.interface';
import { AppState } from 'src/app/store/reducers';
import { getFingerPrintingResult } from '../../store/selectors/songs.selector';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {
  fingerPrintingResult: FingerPrintingResult;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.select(getFingerPrintingResult).subscribe(res => this.fingerPrintingResult = res);
    console.log(this.fingerPrintingResult);
  }

}
