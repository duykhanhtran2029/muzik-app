import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artist, RawArtist } from 'src/app/interfaces/artist.interface';
import { environment } from 'src/environments/environment';
import { Song } from 'src/app/interfaces/song.interface';
import { Playlist, PlaylistSong } from 'src/app/interfaces/playlist.interface';
import { QueryParamsHelper } from './helpers/query-params.helper';
import { Tag, TrainedModel } from 'src/app/interfaces/model.interface';

@Injectable({
  providedIn: 'root',
})
export class MusicPlayerPlaylistService {
  API_BASE_URL = environment.MUSIC_API_URL;
  RECOMMEND_URL = environment.RECOMMEND_API_URL;

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

  getPlaylistsByUserId(userId: string): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(
      `${this.API_BASE_URL}/api/Playlists/userID/${userId}`
    );
  }

  addSongToPlaylist(playlistSong: PlaylistSong): Observable<Song[]> {
    return this.http.post<Song[]>(
      `${this.API_BASE_URL}/api/PlaylistSongs`,
      playlistSong
    );
  }

  createPlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.post<Playlist>(
      `${this.API_BASE_URL}/api/Playlists`,
      playlist
    );
  }

  updatePlaylist(playlist: Playlist): Observable<Playlist> {
    return this.http.put<Playlist>(
      `${this.API_BASE_URL}/api/Playlists/${playlist.playlistId}`,
      playlist
    );
  }

  deleteSongFromPlaylist(playlist: PlaylistSong): Observable<Song[]> {
    return this.http.put<Song[]>(
      `${this.API_BASE_URL}/api/PlaylistSongs`,
      playlist
    );
  }

  deletePlaylist(playlistId: string): Observable<string> {
    return this.http.delete<string>(
      `${this.API_BASE_URL}/api/Playlists/${playlistId}`
    );
  }

  getGenre(genreId: string): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(
      `${this.API_BASE_URL}/api/Playlists/genres/${genreId}`
    );
  }

  getModelInformation(modelId: string): Observable<TrainedModel> {
    const url = `${this.RECOMMEND_URL}/models?modelId=${modelId}`;
    return this.http.get<TrainedModel>(url);
  }

  getTagInformation(): Observable<Tag[]> {
    const url = `${this.RECOMMEND_URL}/tags`;
    return this.http.get<Tag[]>(url);
  }
}
