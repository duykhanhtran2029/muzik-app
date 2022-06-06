import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable, takeWhile, tap } from 'rxjs';
import { Artist } from 'src/app/interfaces/artist.interface';
import { ConfirmDeleteComponent } from '../confirm-delete/confirm-delete.component';
import { AddArtistComponent } from './add-artist/add-artist.component';
import { ArtistDetailComponent } from './artist-detail/artist-detail.component';
import { ManagerArtistsStore } from './manager-artists.store';
import { UpdateArtistComponent } from './update-artist/update-artist.component';


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
    'numberOfSongs',
    'likes',
    'downloads',
    'listens',
    'actions',
  ];
  dataSource: MatTableDataSource<Artist>;
  artists$ = this.componentStore.artists$;
  componentActive = true;
  detailDialogRef: MatDialogRef<ArtistDetailComponent>;
  deleteDialogRef: MatDialogRef<ConfirmDeleteComponent>;
  updateDialogRef: MatDialogRef<UpdateArtistComponent>;
  addDialogRef: MatDialogRef<AddArtistComponent>;

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

  openDetail(artist: Artist) {
    this.detailDialogRef = this.dialog.open(ArtistDetailComponent, {
      data: artist,
      panelClass: 'no-padding-dialog',
      height: '356px'
    });
  }

  openDelete(artist: Artist) {
    this.deleteDialogRef = this.dialog.open(ConfirmDeleteComponent, { data: {artist: artist} });
    this.deleteDialogRef.afterClosed().subscribe((deleted) => {
      if (deleted) {
        this.dataSource.data = this.dataSource.data.filter(s => s !== artist);
        this.toastr.success('Success', 'Artist Deleted');
      } else if(deleted ===false) {
        this.toastr.error('Failed', 'Artist Deleted Failed');
      }
    });
  }

  openUpdate(artist: Artist) {
    this.updateDialogRef = this.dialog.open(UpdateArtistComponent, {
      data: artist,
      disableClose: true,
    });
    this.updateDialogRef.afterClosed().subscribe((updated) => {
      switch (updated) {
        case undefined:
          break;
        case false:
          this.toastr.error('Failed', 'Artist Updated Failed');
          break;
        default:
          this.toastr.success('Success', 'Artist Updated');
          const index = this.dataSource.data.findIndex(a => a.artistId === artist.artistId);
          this.dataSource.data[index] = updated.artist;
          this.dataSource.paginator = this.paginator;
          break;
      }
    });
  }

  openAdd() {
    this.addDialogRef = this.dialog.open(AddArtistComponent, {
      disableClose: true,
    });
    this.addDialogRef.afterClosed().subscribe((created) => {
      switch (created) {
        case undefined:
          break;
        case false:
          this.toastr.error('Failed', 'Artist Added Failed');
          break;
        default:
          this.toastr.success('Success', 'Artist Added');
          this.dataSource.data.unshift({...created.artist, likes: 0, downloads: 0, numberOfSongs: 0, listens: 0});
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          break;
      }
    });
  }
}
