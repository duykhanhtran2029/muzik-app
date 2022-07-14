import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistComponent } from '../components/artist/artist.component';
import { HomeComponent } from '../components/home/home.component';
import { ManagerComponent } from '../components/manager/manager.component';
import { MasterComponent } from '../components/master/master.component';
import { MusicPlayerComponent } from '../components/music-player/music-player.component';
import { PlaylistManagerComponent } from '../components/playlist-manager/playlist-manager.component';
import { RecorderComponent } from '../components/recorder/recorder.component';
import { ResultComponent } from '../components/result/result.component';
import { AuthGuard } from '../guards/auth.guard';
import { DetailPlaylistComponent } from '../components/detail-playlist/detail-playlist';
import { DetailGenreComponent } from '../components/detail-genre/detail-genre.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'recognizer', component: RecorderComponent },
      { path: 'result', component: ResultComponent },
      {
        path: 'manager',
        component: ManagerComponent,
        canActivate: [AuthGuard],
      },
      { path: 'player', component: MusicPlayerComponent },
      { path: 'artist/:id', component: ArtistComponent, pathMatch: 'full' },
      { path: 'playlists', component: PlaylistManagerComponent },
      {
        path: 'genres/:id',
        component: DetailGenreComponent,
        pathMatch: 'full',
      },
      {
        path: 'playlist/:id',
        component: DetailPlaylistComponent,
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicPlayerRoutingModule {}
