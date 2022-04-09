import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rounded-song',
  templateUrl: './rounded-song.component.html',
  styleUrls: ['./rounded-song.component.scss']
})
export class RoundedSongComponent implements OnInit {
  @Input() imgSrc: string;
  constructor() { }

  ngOnInit(): void {
  }

}
