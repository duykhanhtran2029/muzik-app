import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { getIsAdmin, getIsAuthenticated } from '../../store/selectors/core.selector';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss']
})
export class MasterComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<AppState>,
  ) { }

  componentActive = true;
  isAdmin = false;
  isAuthenticated = false;

  ngOnInit(): void {
    this.store.select(getIsAdmin).subscribe(isAdmin => this.isAdmin = isAdmin);
    this.store.select(getIsAuthenticated).subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
  }

  ngOnDestroy(): void {
    this.componentActive = false;
  }

}
