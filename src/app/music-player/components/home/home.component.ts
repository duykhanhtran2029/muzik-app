import { Component } from '@angular/core';
import { AppState } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { getUserId } from '../../store/selectors/core.selector';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private store: Store<AppState>) {}

  userId: string;

  ngOnInit(): void {
    this.store.select(getUserId).subscribe((res) => {
      if (res != undefined) {
        this.userId = res;
      }
    });
  }
}
