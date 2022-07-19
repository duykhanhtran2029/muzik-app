import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getAllRecommendSongs } from '../../store/selectors/core.selector';

@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss']
})
export class ForYouComponent {
  constructor(
    private store: Store<AppState>
  ) {}
  songs$ = this.store.select(getAllRecommendSongs);
}
