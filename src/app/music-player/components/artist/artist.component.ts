import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeWhile } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { ArtistStore } from './artist.store';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.scss'],
  providers: [ArtistStore]
})
export class ArtistComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private componentStore: ArtistStore
    ) { }

  componentActive = true;
  songs$ = this.componentStore.songs$;
  artist$ = this.componentStore.artist$;
  selectedSong: Song;

  ngOnDestroy(): void {
    this.componentActive = false;
  }

  ngOnInit(): void {
    this.route.params.pipe(takeWhile(() => this.componentActive)).subscribe(params => {
      this.componentStore.getArtistEffect(params['id']);
      this.componentStore.getSongsEffect(params['id']);
    });

  }

}
