import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutControllerComponent } from '../components/layout-controller/layout-controller.component';
import { MasterComponent } from '../components/master/master.component';
import { RecorderComponent } from '../components/recorder/recorder.component';

const routes: Routes = [
    {
        path: '', component: MasterComponent,
        children: [
            { path: '', redirectTo: 'audio-regconizer', pathMatch: 'full' },
            { path: 'audio-regconizer', component: LayoutControllerComponent},
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AudioRecognizerRoutingModule { }