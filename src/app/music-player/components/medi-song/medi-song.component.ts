import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-medi-song',
  templateUrl: './medi-song.component.html',
  styleUrls: ['./medi-song.component.scss']
})
export class MediSongComponent implements OnInit {
  @Input() imgSrc: string;
  constructor() { }

  ngOnInit(): void {
  }

}
