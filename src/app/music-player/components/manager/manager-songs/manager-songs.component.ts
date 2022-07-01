import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable, takeWhile, tap } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { getAllSongs } from 'src/app/music-player/store/selectors/core.selector';
import { AppState } from 'src/app/store/reducers';
import { ManagerSongsStore } from './manager-songs.store';
import { AddSongComponent } from './add-song/add-song.component';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { SongDetailComponent } from './song-detail/song-detail.component';
import { UpdateSongComponent } from './update-song/update-song.component';
import * as SongAction from '../../../store/actions/core.actions';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';
import { ConfirmRecognizenComponent } from '../confirm-recognizen/confirm-recognizen.component';


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
  refDialogRef: MatDialogRef<ConfirmRecognizenComponent>;

  componentActive = true;
  deleteSongStatus$: Observable<ApiRequestStatus>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private componentStore: ManagerSongsStore
  ) { }

  ngOnInit(): void {
    this.store.dispatch(SongAction.getSongs());
    this.songs$ = this.store.select(getAllSongs).pipe(
      tap((songs: Song[]) => {
        this.dataSource = new MatTableDataSource(songs);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.setupFilter();
      }),
      takeWhile(() => this.componentActive)
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
      const searchPattern = (s.songName + ' ' + s.artistsName + ' ' + s.songId).toLocaleLowerCase();
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

  openDelete(song: Song) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, { data: { song: song } });
    this.deleteDialogRef.afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.dataSource.data = this.dataSource.data.filter(s => s !== song);
        this.toastr.success('Success', 'Song Deleted');
      } else if (deleted === false) {
        this.toastr.error('Failed', 'Song Deleted Failed');
      }
    });
  }

  openUpdate(song: Song) {
    this.updateDialogRef = this.dialog.open(UpdateSongComponent, {
      data: song,
      disableClose: true,
      width: '348px'
    });
    this.updateDialogRef.afterClosed().subscribe((updated) => {
      switch (updated) {
        case undefined:
          break;
        case false:
          this.toastr.error('Failed', 'Song Updated Failed');
          break;
        default:
          this.toastr.success('Success', 'Song Updated');
          const index = this.dataSource.data.findIndex(s => s.songId === song.songId);
          const tmpData = [...this.dataSource.data];
          tmpData.splice(index, 1, updated.song);
          this.dataSource.data = tmpData;
          break;
      }
    });
  }

  openAdd() {
    (this.addDialogRef = this.dialog.open(AddSongComponent)),
    {
      disableClose: true,
      width: '348px'
    };
    this.addDialogRef.afterClosed().subscribe((created) => {
      switch (created) {
        case undefined:
          break;
        case false:
          this.toastr.error('Failed', 'Song Created Failed');
          break;
        default:
          this.toastr.success('Success', 'Song Created');
          const tmpData = [...this.dataSource.data];
          tmpData.unshift({ ...created.song, likes: 0, downloads: 0, listens: 0 });
          this.dataSource.data = tmpData;
          break;
      }
    });
  }

  openReg(song: Song) {
    this.refDialogRef = this.dialog.open(ConfirmRecognizenComponent, { data: song });
    this.refDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.toastr.success('Success', 'Song Processed');
      } else if (result === false) {
        this.toastr.error('Failed', 'Song Processed Failed');
      }
      const index = this.dataSource.data.findIndex(s => s.songId === song.songId);
      const tmpData = [...this.dataSource.data];
      song = {...song, isRecognizable: !song.isRecognizable};
      tmpData.splice(index, 1, song);
      this.dataSource.data = tmpData;
    });
  }
}
