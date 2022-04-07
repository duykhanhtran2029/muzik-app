import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutControllerComponent } from '../components/layout-controller/layout-controller.component';
import { ManagerComponent } from '../components/manager/manager.component';
import { MasterComponent } from '../components/master/master.component';
import { RecorderComponent } from '../components/recorder/recorder.component';
import { ResultComponent } from '../components/result/result.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'audio-recognizer', pathMatch: 'full' },
      { path: 'audio-recognizer', component: LayoutControllerComponent },
      { path: 'result', component: ResultComponent },
      { path: 'manager', component: ManagerComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MusicPlayerRoutingModule {}
