import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { environment } from 'src/environments/environment';
import { QueryParamsHelper } from './helpers/query-params.helper';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerSongService {
  API_BASE_URL = environment.MUSIC_API_URL;
  RECOMMEND_URL = environment.RECOMMEND_API_URL;
  RECOGNIZE_URL = environment.RECOGNIZE_API_URL;
  constructor(private http: HttpClient) {}

  getAllSongs(): Observable<Song[]> {
    const url = `${this.API_BASE_URL}/api/songs`;
    return this.http.get<Song[]>(url);
  }

  getRecommendedGenreSong(userId) {
    const url = `${this.RECOMMEND_URL}/genreRecommend?userId=${userId}`;
    return this.http.get(url);
  }

  getRecommendedSongs(userId): Observable<Song[]> {
    const url = `${this.RECOMMEND_URL}/userRecommend?userId=${userId}`;
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
    return this.http.post<Song[]>(
      `${this.API_BASE_URL}/api/songs/songs`,
      songIds
    );
  }

  getSongFromPlaylist(playlistId: string): Observable<Song[]> {
    return this.http.get<Song[]>(
      `${this.API_BASE_URL}/api/PlaylistSongs/${playlistId}`
    );
  }

  deleteSong(songId: string): Observable<string> {
    return this.http.delete<string>(`${this.API_BASE_URL}/api/songs/${songId}`);
  }

  fingerPrinting(fileName: string): Observable<FingerPrintingResult> {
    return this.http.post<FingerPrintingResult>(
      `${this.RECOGNIZE_URL}/api/fingerPrintings/fingerPrinting`,
      { fileName }
    );
  }

  listenedSong(songId: string): Observable<Song> {
    return this.http.get<Song>(
      `${this.API_BASE_URL}/api/songs/${songId}/listened`
    );
  }

  downloadedSong(songId: string): Observable<Song> {
    return this.http.get<Song>(
      `${this.API_BASE_URL}/api/songs/${songId}/downloaded`
    );
  }

  recognizenSong(songId: string): Observable<Song> {
    return this.http.get<Song>(
      `${this.API_BASE_URL}/api/songs/${songId}/recognizen`
    );
  }

  searchSongs(searchKey: string): Observable<Song[]> {
    const params = new HttpParams().set(
      'searchKey',
      searchKey.trim().toLowerCase()
    );
    return this.http.get<Song[]>(`${this.API_BASE_URL}/api/songs/search`, {
      params: params,
    });
  }
}
