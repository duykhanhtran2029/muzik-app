import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, takeWhile } from 'rxjs';
import { SearchStore } from './search.store';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [SearchStore]
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<SearchComponent>,
    private componentStore: SearchStore
  ) { }
  searchHistories: string[] = [];
  componentActive = true;
  searchControl = new FormControl();
  songs$ = this.componentStore.songs$;
  artists$ = this.componentStore.artists$;
  ngOnInit(): void {
    this.searchHistories = JSON.parse(localStorage.getItem('music-player__searchHistory'));
    this.searchControl.valueChanges.pipe(
      takeWhile(() => this.componentActive),
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((searchText) => {
      this.componentStore.searchArtistsEffect(searchText);
      this.componentStore.searchSongsEffect(searchText);
    });
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  redirect() {
    this.router.navigate(['app/recognizer']);
    this.dialogRef.close();
  }

  updateSearchHistories(searchText: string) {
    if(this.searchHistories.indexOf(searchText) === -1) {
      this.searchHistories.unshift(searchText);
      this.searchHistories = this.searchHistories.slice(0,5);
      localStorage.setItem('music-player__searchHistory', JSON.stringify(this.searchHistories));
    }
  }
}
