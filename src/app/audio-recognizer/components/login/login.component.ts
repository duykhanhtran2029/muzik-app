import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<LoginComponent>) {}

  ngOnInit(): void {}

  signUpClick() {
    document.getElementById('container').classList.add('right-panel-active');
  }

  signInClick() {
    document.getElementById('container').classList.remove('right-panel-active');
  }
}
