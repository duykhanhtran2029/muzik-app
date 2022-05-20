import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Song } from 'src/app/interfaces/song.interface';

import {
  FingerPrintingResult,
  MatchedSong,
} from 'src/app/interfaces/fingerPrintingResult.interface';
const HOST_ZINGMP3 = 'https://zingmp3.vn';

@Component({
  selector: 'app-song-item',
  templateUrl: './song-item.component.html',
  styleUrls: ['./song-item.component.scss'],
})
export class SongItemComponent implements OnInit, OnChanges {
  @Input() hasRightContent: boolean = true;
  @Input() hasCenterContent: boolean = true;
  @Input() currentActivateID: number;
  @Input() matchedSong: MatchedSong;
  @Output() activated = new EventEmitter<number>();
  isActivated: boolean = false;
  textColor: number;
  score: number;
  constructor() {}

  ngOnInit(): void {
    if (this.matchedSong.score >= 50) this.textColor = 1;
    else if (this.matchedSong.score < 50 && this.matchedSong.score > 20)
      this.textColor = 0;
    else this.textColor = -1;

    this.score = Math.floor(this.matchedSong.score * 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentActivateID'].currentValue == this.matchedSong.song.songId) {
      this.isActivated = true;
    } else {
      this.isActivated = false;
    }
  }

  openInNewTab(url: string) {
    window.open(HOST_ZINGMP3 + url, '_blank').focus();
  }

  Active() {
    if (!this.isActivated) {
      //this.activated.emit(this.matchedSong.song.songId);
      this.isActivated = true;
    }
  }

  download() {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = this.matchedSong.song.songId + '.mp3';
    dlink.href = this.matchedSong.song.link.toString();
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }
}
