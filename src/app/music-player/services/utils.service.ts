import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MusicPlayerSongService } from './music-player.song.service';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  constructor(private http: HttpClient) {}

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob',
    });
  }

  newID(isArtist = false) {
    const id =
      (isArtist ? 'AW' : 'SW') +
      Date.now().toString(36).slice(0, 3) +
      Math.random().toString(36).slice(2, 5);
    return id.toUpperCase();
  }

  playlistID() {
    const id =
      'PW' +
      Date.now().toString(36).slice(0, 3) +
      Math.random().toString(36).slice(2, 5);
    return id.toUpperCase();
  }
}
