import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';


@Injectable()
export class SongService {
    API_BASE_URL = 'https://localhost:5001';

    constructor(private http: HttpClient) {
    }

    getAllSongs(): Observable<Song[]> {
        const url = `${this.API_BASE_URL}/api/songs`
        return this.http.get<Song[]>(url);
    }

    getSong(songId: number): Observable<Song> {
        return this.http.get<Song>(`${this.API_BASE_URL}/api/songs/${songId}`);
    }

    fingerPrinting(formData: FormData): Observable<FingerPrintingResult> {
        return this.http.post<FingerPrintingResult>(`${this.API_BASE_URL}/api/songs/FingerPrinting`, formData);
    }

    createSong(song: Song): Observable<Song> {
        return this.http.post<Song>(`${this.API_BASE_URL}/api/songs`, song);
    }

    deleteSong(songId: number): Observable<any> {
        return this.http.delete(`${this.API_BASE_URL}/api/songs/${songId}`);
    }

    updateSong(songId: number, changes: Partial<Song>): Observable<any> {
        return this.http.put(`${this.API_BASE_URL}/api/songs/${songId}`, changes);
    }
}
