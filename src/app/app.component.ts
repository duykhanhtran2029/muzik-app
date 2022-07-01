import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Muzik';
  isLoaded = false;
  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 1000);
  }
}
