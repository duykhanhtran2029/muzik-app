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
  @Input() song: Song;
  @Output() activated = new EventEmitter<number>();
  isActivated: boolean = false;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentActivateID'].currentValue == this.song.id) {
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
      this.activated.emit(this.song.id);
      this.isActivated = true;
    }
  }

  download() {
    const dlink: HTMLAnchorElement = document.createElement('a');
    dlink.download = this.song.title + '.mp3';
    dlink.href = this.song.link.toString();
    dlink.click(); // this will trigger the dialog window
    dlink.remove();
  }
}
