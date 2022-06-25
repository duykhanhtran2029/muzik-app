import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist, RawArtist } from 'src/app/interfaces/artist.interface';
import { environment } from 'src/environments/environment';
import { Song } from 'src/app/interfaces/song.interface';
import { Playlist, PlaylistSong } from 'src/app/interfaces/playlist.interface';
import { QueryParamsHelper } from './helpers/query-params.helper';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerPlaylistService {
  API_BASE_URL = environment.apiMusicUrl;
  RECOMMEND_URL = environment.apiRecommendUrl;

  constructor(private http: HttpClient) {}

  getAllPlaylists(): Observable<Playlist[]> {
    const url = `${this.API_BASE_URL}/api/playlists`;
    return this.http.get<Playlist[]>(url);
  }

  getPlaylistSongs(playlistId: string): Observable<Song[]> {
    return this.http.get<Song[]>(
      `${this.API_BASE_URL}/api/PlaylistSongs/${playlistId}`
    );
  }

  getPlaylistRecommendSongs(playlistId: string): Observable<Song[]> {
    return this.http.get<Song[]>(
      `${this.RECOMMEND_URL}/playlistRecommend?playlistId=${playlistId}`
    );
  }

  getPlaylist(playlistId: string): Observable<Playlist> {
    return this.http.get<Playlist>(
      `${this.API_BASE_URL}/api/playlists/${playlistId}`
    );
  }

  getPlaylistsByUserId(userId: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(
      `${this.API_BASE_URL}/api/Playlists/userID/${userId}`
    );
  }

  addSongToPlaylist(playlistSong: PlaylistSong): Observable<PlaylistSong> {
    return this.http.post<PlaylistSong>(
      `${this.API_BASE_URL}/api/PlaylistSong`,
      playlistSong
    );
  }

  createPlaylist(artist: RawArtist): Observable<Artist> {
    return this.http.post<Artist>(`${this.API_BASE_URL}/api/Artists`, artist);
  }
}
