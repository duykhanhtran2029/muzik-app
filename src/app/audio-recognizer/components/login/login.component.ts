import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Output() loggedIn = new EventEmitter<boolean>();
  constructor(private dialogRef: MatDialogRef<LoginComponent>) {}

  ngOnInit(): void {}

  signUpClick() {
    document.getElementById('container').classList.add('right-panel-active');
  }

  signInClick() {
    document.getElementById('container').classList.remove('right-panel-active');
  }
  login() {
    this.loggedIn.emit(true);
  }
}
