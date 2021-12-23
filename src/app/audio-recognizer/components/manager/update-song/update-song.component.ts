import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { SongService } from 'src/app/audio-recognizer/services/songs.service';
import { updateSong } from 'src/app/audio-recognizer/store/actions/songs.actions';
import { Song } from 'src/app/interfaces/song.interface';
import { AppState } from 'src/app/store/reducers';

@Component({
  selector: 'app-update-song',
  templateUrl: './update-song.component.html',
  styleUrls: ['./update-song.component.scss']
})
export class UpdateSongComponent implements OnInit {
  song: Song;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Song,
    private songService: SongService,
    private store: Store<AppState>,
    private dialogRef: MatDialogRef<UpdateSongComponent>) { }

  ngOnInit(): void {
    this.song = { ...this.data};
  }
  setFilename(files) {
    if (files[0]) {
      const formData = new FormData();
      formData.append(files[0].name, files[0]);

      this.songService.uploadImage(formData).subscribe(({ path }) => (this.song.thumbnail = path));
    }
  }

  save() {
    const update: Update<Song> = {
      id: this.song.id,
      changes: {
        ...this.song
      }
    };
    this.store.dispatch(updateSong({ update }));
    this.dialogRef.close(true);
  }
  cancel()
  {
    this.dialogRef.close(false);
  }

}
