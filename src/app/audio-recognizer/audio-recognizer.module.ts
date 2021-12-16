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

@NgModule({
  declarations: [
    MasterComponent,
    RecorderComponent,
    ManagerComponent,
    LayoutControllerComponent,
    VisualizaionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AudioRecognizerRoutingModule,
    AudioRecognizerSharedMaterialModule,
  ]
})
export class AudioRecognizerModule { }
