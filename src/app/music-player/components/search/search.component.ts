import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<SearchComponent>
    ) { }
  searchHistories: string[] = [];
  ngOnInit(): void {
    this.searchHistories = JSON.parse(localStorage.getItem('music-player__searchHistory'));
  }

  ngOnDestroy(): void {
      localStorage.setItem('music-player__searchHistory', JSON.stringify(this.searchHistories));
  }

  keyUp(e: KeyboardEvent) {
    if (e.key === 'Enter') {

    }
  }

  redirect() {
    this.router.navigate(['app/recognizer']);
    this.dialogRef.close();
  }
}
