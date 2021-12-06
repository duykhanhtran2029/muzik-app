import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MasterComponent } from '../components/master/master.component';

const routes: Routes = [
    {
        path: '', component: MasterComponent,
        children: [
            { path: '', redirectTo: 'audio-regconizer', pathMatch: 'full' },
            { path: 'audio-regconizer', component: MasterComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AudioRecognizerRoutingModule { }