import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { getUserId } from '../../store/selectors/core.selector';
import { DetailGenreStore } from './detail-genre.store';
@Component({
  selector: 'app-detail-genre',
  templateUrl: './detail-genre.component.html',
  styleUrls: ['./detail-genre.component.scss'],
  providers: [DetailGenreStore],
})
export class DetailGenreComponent implements OnInit {
  constructor(
    private genreStore: DetailGenreStore,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  genreId: string;
  genreTitle: string;
  playlists$ = this.genreStore.playlists$;

  ngOnInit(): void {
    this.genreId = this.route.snapshot.paramMap.get('id');
    switch (this.genreId) {
      case '1':
        this.genreTitle = 'Recently Playlist';
        this.genreStore.getPlaylistsEffect('2');
        break;
      case '2':
        this.genreTitle = "Muzik's Choices";
        this.genreStore.getPlaylistsEffect('2');
        break;
      case '3':
        this.genreTitle = 'Hit of Artists';
        this.genreStore.getPlaylistsEffect('3');
        break;
      case '4':
        this.genreTitle = 'Top 100';
        this.genreStore.getPlaylistsEffect('4');
        break;
      default:
        this.genreTitle = 'Top 100';
        this.genreStore.getPlaylistsEffect('4');
        break;
    }
  }
}
