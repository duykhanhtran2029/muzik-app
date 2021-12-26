import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/audio-recognizer/components/login/login.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  hasLoggedIn: boolean = false;
  loginDialogRef: MatDialogRef<LoginComponent>;
  constructor(private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {}

  BackToHome() {
    this.router.navigateByUrl('/app/audio-recognizer');
  }

  toAdminPage() {
    this.router.navigateByUrl('app/manager');
  }
  openLoginForm() {
    this.loginDialogRef = this.dialog.open(LoginComponent, {
      panelClass: 'transparent-dialog',
      width: '100%',
      height: '800px',
    });
    this.loginDialogRef.componentInstance.loggedIn.subscribe((result) => {
      if (result == true) {
        this.hasLoggedIn = true;
        this.loginDialogRef.close();
      }
    });
  }

  logout() {
    this.hasLoggedIn = false;
  }
}
