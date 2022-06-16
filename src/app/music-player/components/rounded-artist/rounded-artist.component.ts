import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Artist } from 'src/app/interfaces/artist.interface';

@Component({
  selector: 'app-rounded-artist',
  templateUrl: './rounded-artist.component.html',
  styleUrls: ['./rounded-artist.component.scss']
})
export class RoundedArtistComponent implements OnInit {

  constructor(private router: Router) { }
  @Input() artist: Artist;
  ngOnInit(): void {
  }

  redirect() {
    this.router.navigate(['app/artist', this.artist.artistId]);
  }

}
