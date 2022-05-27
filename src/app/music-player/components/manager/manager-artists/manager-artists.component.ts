import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, takeWhile, tap } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { AppState } from 'src/app/store/reducers';
import { ManagerArtistsStore } from './manager-artists.store';


@Component({
  selector: 'app-manager-artists',
  templateUrl: './manager-artists.component.html',
  styleUrls: ['./manager-artists.component.scss'],
  providers: [ManagerArtistsStore]
})
export class ManagerArtistsComponent implements OnInit, OnDestroy  {
  displayedColumns: string[] = [
    'artistId',
    'thumbnail',
    'artistName',
    'likes',
    'downloads',
    'listens',
    'actions',
  ];
  dataSource: MatTableDataSource<Artist>;
  artists$ = this.componentStore.artists$;
  componentActive = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private componentStore: ManagerArtistsStore,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.componentStore.artists$.pipe(takeWhile(() => this.componentActive)).subscribe(artists => {
      this.dataSource = new MatTableDataSource(artists);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.setupFilter();
    });
    this.componentStore.getArtistsEffect();
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  setupFilter() {
    this.dataSource.filterPredicate = (a: Artist, filter: string) => {
      const searchPattern = (a.artistName + ' ' + a.artistId).toLocaleLowerCase() ;
      return searchPattern.includes(filter);
    };
  }

  doFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
  }
}
