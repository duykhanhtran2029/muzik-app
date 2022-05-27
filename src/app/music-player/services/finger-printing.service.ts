import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from 'src/app/interfaces/song.interface';
import { FingerPrintingResult } from 'src/app/interfaces/fingerPrintingResult.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FingerPrintingService {
  API_BASE_URL = environment.apiRecognizeUrl;

  constructor(private http: HttpClient) {}

  fingerPrinting(fileName: string): Observable<FingerPrintingResult> {
    return this.http.post<FingerPrintingResult>(
      `${this.API_BASE_URL}/api/songs/FingerPrinting`,
      { fileName }
    );
  }
}
