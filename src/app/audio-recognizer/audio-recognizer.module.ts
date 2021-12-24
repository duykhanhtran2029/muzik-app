import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterComponent } from './components/master/master.component';
import { RecorderComponent } from './components/recorder/recorder.component';
import { SharedModule } from '../shared/shared.module';
import { AudioRecognizerRoutingModule } from './sub-modules/audio-recognizer.routing';
import { AudioRecognizerSharedMaterialModule } from './sub-modules/audio-recognizer-material.module';
import { ManagerComponent } from './components/manager/manager.component';
import { LayoutControllerComponent } from './components/layout-controller/layout-controller.component';
import { VisualizaionComponent } from './components/visualizaion/visualizaion.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { songReducer } from './store/reducers/songs.reducer';
import { SongEffects } from './store/effects/songs.effects';
import { SongService } from './services/songs.service';
import { ResultComponent } from './components/result/result.component';
import { SongItemComponent } from './components/song-item/song-item.component';
import { PlayingBarComponent } from './components/playing-bar/playing-bar.component';
import { SongDetailComponent } from './components/manager/song-detail/song-detail.component';
import { ConfirmDeleteComponent } from './components/manager/confirm-delete/confirm-delete.component';
import { UpdateSongComponent } from './components/manager/update-song/update-song.component';
import { FormsModule } from '@angular/forms';
import { PlayerComponent } from './components/result/player/player.component';

@NgModule({
  declarations: [
    MasterComponent,
    RecorderComponent,
    ManagerComponent,
    LayoutControllerComponent,
    VisualizaionComponent,
    ResultComponent,
    SongItemComponent,
    PlayingBarComponent,
    SongDetailComponent,
    ConfirmDeleteComponent,
    UpdateSongComponent,
    PlayerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    AudioRecognizerRoutingModule,
    AudioRecognizerSharedMaterialModule,
    StoreModule.forFeature('songs', songReducer),
    EffectsModule.forFeature([SongEffects]),
  ],
  providers: [SongService],
})
export class AudioRecognizerModule {}
