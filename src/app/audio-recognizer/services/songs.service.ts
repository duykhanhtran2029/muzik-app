import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { environment } from 'src/environments/environment';

@Injectable()
export class SongService {
  API_BASE_URL = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<Song[]> {
    const url = `${this.API_BASE_URL}/api/songs`;
    return this.http.get<Song[]>(url);
  }

  getSong(songId: number): Observable<Song> {
    return this.http.get<Song>(`${this.API_BASE_URL}/api/songs/${songId}`);
  }

  createSong(song: Song): Observable<Song> {
    return this.http.post<Song>(`${this.API_BASE_URL}/api/songs`, song);
  }

  updateSong(song: Song): Observable<Song> {
    return this.http.put<Song>(
      `${this.API_BASE_URL}/api/songs/${song.id}`,
      song
    );
  }

  deleteSong(songId: number): Observable<Song> {
    return this.http.delete<Song>(`${this.API_BASE_URL}/api/songs/${songId}`);
  }

  fingerPrinting(fileName: string): Observable<FingerPrintingResult> {
    return this.http.post<FingerPrintingResult>(
      `${this.API_BASE_URL}/api/songs/FingerPrinting`,
      fileName
    );
  }
}
