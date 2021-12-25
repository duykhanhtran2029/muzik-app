import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { SongService } from 'src/app/audio-recognizer/services/songs.service';
import { deleteSong } from 'src/app/audio-recognizer/store/actions/songs.actions';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-confirm-delete',
  templateUrl: './confirm-delete.component.html',
  styleUrls: ['./confirm-delete.component.scss']
})
export class ConfirmDeleteComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) 
    private data: number,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<ConfirmDeleteComponent>) { }

  ngOnInit(): void {
    console.log(this.data);
  }
  
  close()
  {
    this.store.dispatch(deleteSong({ songId: this.data}));
    this.dialogRef.close();
  }

}
