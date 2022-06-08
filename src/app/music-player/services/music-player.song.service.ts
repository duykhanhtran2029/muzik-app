import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerSongService {
  API_BASE_URL = environment.apiMusicUrl;
  RECOMMEND_URL = environment.apiRecommendUrl;
  RECOGNIZE_URL = environment.apiRecognizeUrl;
  constructor(private http: HttpClient) { }

  getAllSongs(): Observable<Song[]> {
    const url = `${this.API_BASE_URL}/api/songs`;
    return this.http.get<Song[]>(url);
  }

  getRecommendedSongs(songId: string): Observable<Song[]> {
    const url = `${this.RECOMMEND_URL}/recommend?name_file=${songId}`;
    return this.http.get<Song[]>(url);
  }

  getNewestSongs(): Observable<Song[]> {
    const url = `${this.API_BASE_URL}/api/songs/newest`;
    return this.http.get<Song[]>(url);
  }

  getTrendingSong(): Observable<Song[]> {
    const url = `${this.API_BASE_URL}/api/songs/trending`;
    return this.http.get<Song[]>(url);
  }

  getSong(songId: string): Observable<Song> {
    return this.http.get<Song>(`${this.API_BASE_URL}/api/songs/${songId}`);
  }

  createSong(song: Song): Observable<Song> {
    return this.http.post<Song>(`${this.API_BASE_URL}/api/songs`, song);
  }

  updateSong(song: Song): Observable<Song> {
    return this.http.put<Song>(
      `${this.API_BASE_URL}/api/songs/${song.songId}`,
      song
    );
  }

  getSongs(songIds: string[]): Observable<Song[]> {
    return this.http.post<Song[]>(`${this.API_BASE_URL}/api/songs/songs`, songIds);
  }

  deleteSong(songId: string): Observable<string> {
    return this.http.delete<string>(`${this.API_BASE_URL}/api/songs/${songId}`);
  }

  fingerPrinting(fileName: string): Observable<FingerPrintingResult> {
    return this.http.post<FingerPrintingResult>(`${this.RECOGNIZE_URL}/api/fingerPrintings/fingerPrinting`, { fileName });
  }
}
