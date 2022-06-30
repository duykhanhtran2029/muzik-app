import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterComponent } from './components/master/master.component';
import { RecorderComponent } from './components/recorder/recorder.component';
import { SharedModule } from '../shared/shared.module';
import { MusicPlayerRoutingModule } from './sub-modules/music-player.routing';
import { MusicPlayerSharedMaterialModule } from './sub-modules/music-player-material.module';
import { ManagerComponent } from './components/manager/manager.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { coreReducer } from './store/reducers/core.reducer';
import { CoreEffects } from './store/effects/core.effects';
import { ResultComponent } from './components/result/result.component';
import { SongDetailComponent } from './components/manager/manager-songs/song-detail/song-detail.component';
import { ConfirmDeleteComponent } from './components/manager/confirm-delete/confirm-delete.component';
import { UpdateSongComponent } from './components/manager/manager-songs/update-song/update-song.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddSongComponent } from './components/manager/manager-songs/add-song/add-song.component';
import { VisualizationComponent } from './components/recorder/visualization/visualization.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { TracksControlComponent } from './components/tracks-control/tracks-control.component';
import { QueueComponent } from './components/queue/queue.component';
import { MiniSongComponent } from './components/mini-song/mini-song.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HomeComponent } from './components/home/home.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NewsComponent } from './components/news/news.component';
import { MediSongComponent } from './components/medi-song/medi-song.component';
import { ForYouComponent } from './components/for-you/for-you.component';
import { RecommendGenresComponent } from './components/recommend-genres/recommend-genres.component';
import { RoundedSongComponent } from './components/rounded-song/rounded-song.component';
import { TrendingComponent } from './components/trending/trending.component';
import { TopSongComponent } from './components/trending/top-song/top-song.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { SearchComponent } from './components/search/search.component';
import { SearchChipComponent } from './components/search/search-chip/search-chip.component';
import { CarouselComponent } from './components/news/carousel/carousel.component';
import { CarouselSlideComponent } from './components/news/carousel/carousel-slide/carousel-slide.component';
import { TopArtistComponent } from './components/trending/top-artist/top-artist/top-artist.component';
import { ArtistComponent } from './components/artist/artist.component';
import { StrictSongComponent } from './components/strict-song/strict-song.component';
import { ManagerSongsComponent } from './components/manager/manager-songs/manager-songs.component';
import { ManagerArtistsComponent } from './components/manager/manager-artists/manager-artists.component';
import { PlaylistManagerComponent } from './components/playlist-manager/playlist-manager.component';
import { NewPlaylistComponent } from './components/playlist-manager/new-playlist/new-playlist';
import { MyPlaylistComponent } from './components/playlist-manager/my-playlist/my-playlist';
import { DetailPlaylistComponent } from './components/detail-playlist/detail-playlist';
import { DetailPlaylistInformationComponent } from './components/detail-playlist/detail-information/detail-information.component';
import { CreateNewPlaylistComponent } from './components/playlist-manager/create-new-playlist/create-new-playlist.component';
import { PlaylistSongComponent } from './components/detail-playlist/playlist-song/playlist-song';
import { PlaylistRecommendSongComponent } from './components/detail-playlist/playlist-recommend-song/playlist-recommend-song.component';
import { ArtistDetailComponent } from './components/manager/manager-artists/artist-detail/artist-detail.component';
import { UpdateArtistComponent } from './components/manager/manager-artists/update-artist/update-artist.component';
import { AddArtistComponent } from './components/manager/manager-artists/add-artist/add-artist.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ResultSongComponent } from './components/result/result-song/result-song.component';
import { RoundedArtistComponent } from './components/rounded-artist/rounded-artist.component';

@NgModule({
  declarations: [
    MasterComponent,
    RecorderComponent,
    ManagerComponent,
    ResultComponent,
    SongDetailComponent,
    ConfirmDeleteComponent,
    UpdateSongComponent,
    AddSongComponent,
    VisualizationComponent,
    SideNavComponent,
    TracksControlComponent,
    QueueComponent,
    MiniSongComponent,
    HomeComponent,
    NewsComponent,
    MediSongComponent,
    ForYouComponent,
    RecommendGenresComponent,
    RoundedSongComponent,
    TrendingComponent,
    TopSongComponent,
    MusicPlayerComponent,
    SearchComponent,
    SearchChipComponent,
    CarouselComponent,
    CarouselSlideComponent,
    TopArtistComponent,
    ArtistComponent,
    StrictSongComponent,
    ManagerSongsComponent,
    ManagerArtistsComponent,
    PlaylistManagerComponent,
    DetailPlaylistInformationComponent,
    CreateNewPlaylistComponent,
    DetailPlaylistComponent,
    MyPlaylistComponent,
    NewPlaylistComponent,
    PlaylistSongComponent,
    PlaylistRecommendSongComponent,
    ArtistDetailComponent,
    UpdateArtistComponent,
    AddArtistComponent,
    ResultSongComponent,
    RoundedArtistComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    NgxMatSelectSearchModule,
    DragDropModule,
    MusicPlayerRoutingModule,
    MusicPlayerSharedMaterialModule,
    StoreModule.forFeature('core', coreReducer),
    EffectsModule.forFeature([CoreEffects]),
  ],
})
export class MusicPlayerModule {}
