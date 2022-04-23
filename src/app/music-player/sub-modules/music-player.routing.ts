import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { LayoutControllerComponent } from '../components/layout-controller/layout-controller.component';
import { ManagerComponent } from '../components/manager/manager.component';
import { MasterComponent } from '../components/master/master.component';
import { MusicPlayerComponent } from '../components/music-player/music-player.component';
import { RecorderComponent } from '../components/recorder/recorder.component';
import { ResultComponent } from '../components/result/result.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'audio-recognizer', component: LayoutControllerComponent },
      { path: 'result', component: ResultComponent },
      { path: 'manager', component: ManagerComponent },
      { path: 'player', component: MusicPlayerComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicPlayerRoutingModule {}
