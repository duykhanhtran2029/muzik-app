import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from 'src/app/interfaces/artist.interface';

@Component({
  selector: 'app-top-artist',
  templateUrl: './top-artist.component.html',
  styleUrls: ['./top-artist.component.scss']
})
export class TopArtistComponent implements OnInit {
  @Input() index: number;
  @Input() artist: Artist;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  redirect() {
    this.router.navigate(['app/artist', this.artist.artistId]);
  }

}
