import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { getAllSongs } from 'src/app/music-player/store/selectors/songs.selector';
import { AppState } from 'src/app/store/reducers';
import { ManagerSongsStore } from './manager-songs.store';
import { AddSongComponent } from './add-song/add-song.component';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { SongDetailComponent } from './song-detail/song-detail.component';
import { UpdateSongComponent } from './update-song/update-song.component';
import * as SongAction from '../../../store/actions/songs.actions';


@Component({
  selector: 'app-manager-songs',
  templateUrl: './manager-songs.component.html',
  styleUrls: ['./manager-songs.component.scss'],
  providers: [ManagerSongsStore]
})
export class ManagerSongsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [
    'songId',
    'thumbnail',
    'songName',
    'artistsName',
    'likes',
    'downloads',
    'listens',
    'actions',
  ];
  dataSource: MatTableDataSource<Song>;
  songs$: Observable<Song[]>;
  detailDialogRef: MatDialogRef<SongDetailComponent>;
  deleteDialogRef: MatDialogRef<ConfirmDeleteComponent>;
  updateDialogRef: MatDialogRef<UpdateSongComponent>;
  addDialogRef: MatDialogRef<AddSongComponent>;
  componentActive = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(SongAction.getSongs());
    this.songs$ = this.store.select(getAllSongs).pipe(
      tap((songs: Song[]) => {
        this.dataSource = new MatTableDataSource(songs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setupFilter();
      })
    );
  }
  ngOnDestroy(): void {
      this.componentActive = false;
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
      const searchPattern = (s.songName + ' ' + s.artistsName + ' ' + s.songId).toLocaleLowerCase() ;
      return searchPattern.includes(filter);
    };
  }

  doFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
  }

  openDetail(song: Song) {
    this.detailDialogRef = this.dialog.open(SongDetailComponent, {
      data: song,
      panelClass: 'transparent-dialog',
    });
  }

  openDelete(id: number) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, {
      data: id,
    });
    this.deleteDialogRef.afterClosed().subscribe((deleted) => {
      if (deleted) this.toastr.success('Success', 'Song Deleted');
    });
  }

  openUpdate(song: Song) {
    this.updateDialogRef = this.dialog.open(UpdateSongComponent, {
      data: song,
      disableClose: true,
    });
    this.updateDialogRef.afterClosed().subscribe((updated) => {
      if (updated) this.toastr.success('Success', 'Song Updated');
    });
  }
  openAdd() {
    (this.addDialogRef = this.dialog.open(AddSongComponent)),
      { disableClose: true };
    this.addDialogRef.afterClosed().subscribe((created) => {
      if (created) this.toastr.success('Success', 'Song Created');
    });
  }
}
