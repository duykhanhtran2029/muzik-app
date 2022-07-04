import { Component, Input, OnInit } from '@angular/core';
import { ForYouStore } from './for-you.store';

@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss'],
  providers: [ForYouStore],
})
export class ForYouComponent implements OnInit {
  constructor(
    private componentStore: ForYouStore,
  ) {}

  @Input() userId: string;
  songs$ = this.componentStore.songs$;
  ngOnInit(): void {
    if (this.userId != undefined) {
      this.componentStore.getSongsEffect(this.userId);
    }
  }
}
