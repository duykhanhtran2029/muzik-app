import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AppState } from 'src/app/store/reducers';
import { Store } from '@ngrx/store';
import { login as loginAction } from '../../store/actions/user.actions';
import { User } from 'src/app/interfaces/user.interface';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() loggedIn = new EventEmitter<boolean>();
  constructor(
    private dialogRef: MatDialogRef<LoginComponent>,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {}

  signUpClick() {
    document.getElementById('container').classList.add('right-panel-active');
  }

  signInClick() {
    document.getElementById('container').classList.remove('right-panel-active');
  }
  login() {
    //this.store.dispatch(loginAction({ user: user }));
    this.loggedIn.emit(true);
  }
}
