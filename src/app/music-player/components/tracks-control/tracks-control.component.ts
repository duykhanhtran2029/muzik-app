import { Component, ElementRef, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QueueComponent } from '../queue/queue.component';

@Component({
  selector: 'app-tracks-control',
  templateUrl: './tracks-control.component.html',
  styleUrls: ['./tracks-control.component.scss']
})
export class TracksControlComponent implements OnInit {
  dialogRef: MatDialogRef<QueueComponent>;
  isQueueOpened = false;
  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {

  }

  toggleQueue() {
    this.isQueueOpened = !this.isQueueOpened;
  }

}
