import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { map, Observable, tap } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { AppState } from 'src/app/store/reducers';
import { SongService } from '../../services/songs.service';
import * as SongAction from '../../store/actions/songs.actions';
import { getAllSongs } from '../../store/selectors/songs.selector';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})
export class ManagerComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'thumbnail' ,'title', 'artist', 'actions'];
  dataSource: MatTableDataSource<Song>;
  songs$: Observable<Song[]>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private _liveAnnouncer: LiveAnnouncer, 
    private _songService: SongService,
    private store: Store<AppState>
    ) { }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    
  }


  ngOnInit(): void {
    this.store.dispatch(SongAction.getSongs());
    this.songs$ = this.store.select(getAllSongs).pipe(tap(
      (songs: Song[]) => {
        this.dataSource = new MatTableDataSource(songs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setupFilter();
      }));
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
    this.dataSource.filterPredicate = (s: Song, filter: string) => {
      const searchPattern = (s.title + ' ' + s.artist).toLocaleLowerCase() ;
      return searchPattern.includes(filter);
    };
  }

  doFilter (event: Event) {
    
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
  }

}
