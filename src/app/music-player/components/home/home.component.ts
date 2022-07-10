import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { getUserId } from '../../store/selectors/core.selector';
import { HomeStore } from './home.component.store';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [HomeStore],
})
export class HomeComponent {
  constructor(
    private store: Store<AppState>,
    private homeStore: HomeStore,
    private _router: Router
  ) {}

  userId: string;
  recentlyPlaylist$ = this.homeStore.playlists$;
  playlist2$ = this.homeStore.playlists2$;
  playlist3$ = this.homeStore.playlists3$;
  playlist4$ = this.homeStore.playlists4$;

  ngOnInit(): void {
    this.store.select(getUserId).subscribe((res) => {
      if (res != undefined) {
        this.userId = res;
        this.homeStore.getPlaylistsEffect(res);
      }
    });
    this.homeStore.getPlaylists2Effect();
    this.homeStore.getPlaylists3Effect();
    this.homeStore.getPlaylists4Effect();
  }

  openDetailGenre(id: number) {
    this._router.navigate(['/app/genres', id]);
  }
}
