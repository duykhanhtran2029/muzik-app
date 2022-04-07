import { NgModule } from '@angular/core';
import { Routes, RouterModule, NoPreloading } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'app', pathMatch: 'full' },
  {
      path: 'app',
      //canActivate: [AuthGuard],
      loadChildren: () => import('./music-player/music-player.module').then(m => m.MusicPlayerModule)
  },
  //{ path: 'error', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
  //{ path: '**', redirectTo: '/error/404-notfound', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
  scrollPositionRestoration: 'enabled',
  preloadingStrategy: NoPreloading,
  relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
