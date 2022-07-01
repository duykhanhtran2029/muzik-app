import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
      path: 'app',
      loadChildren: () => import('./music-player/music-player.module').then(m => m.MusicPlayerModule)
  },
  { path: 'error', loadChildren: () => import('./error-page/error.module').then(m => m.ErrorModule) },
  { path: '**', redirectTo: '/error/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: NoPreloading,
    paramsInheritanceStrategy: 'always',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
