import { Component, OnInit } from '@angular/core';
import { NewsStore } from './news.store';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  providers: [NewsStore]
})
export class NewsComponent implements OnInit {

  constructor(private componentStore: NewsStore) { }
  songs$ = this.componentStore.songs$;
  ngOnInit(): void {
    this.componentStore.getSongsEffect();
  }
}
