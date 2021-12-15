import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterComponent } from './components/master/master.component';
import { RecorderComponent } from './components/recorder/recorder.component';
import { SharedModule } from '../shared/shared.module';
import { AudioRecognizerRoutingModule } from './sub-modules/audio-recognizer.routing';
import { AudioRecognizerSharedMaterialModule } from './sub-modules/audio-recognizer-material.module';



@NgModule({
  declarations: [
    MasterComponent,
    RecorderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AudioRecognizerRoutingModule,
    AudioRecognizerSharedMaterialModule
  ]
})
export class AudioRecognizerModule { }
