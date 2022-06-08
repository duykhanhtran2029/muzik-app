import { Component, OnInit } from '@angular/core';
import { tapResponse } from '@ngrx/component-store';
import { Song } from 'src/app/interfaces/song.interface';
import { MusicPlayerSongService } from '../../services/music-player.song.service';

@Component({
  selector: 'app-recommend-genres',
  templateUrl: './recommend-genres.component.html',
  styleUrls: ['./recommend-genres.component.scss'],
})
export class RecommendGenresComponent implements OnInit {
  constructor(private songService: MusicPlayerSongService) {}

  selectedSongs: Song[];
  selectedIndex: number = 0;
  genres: any = [];

  ngOnInit(): void {
    this.songService.getRecommendedGenreSong(2).subscribe((res) => {
      this.selectedSongs = res[0].songs;
      this.genres = res;
    });
  }
  select(i): void {
    this.selectedIndex = i;
    this.selectedSongs = this.genres[i].songs;
  }
}
