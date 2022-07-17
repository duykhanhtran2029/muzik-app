import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Playlist } from 'src/app/interfaces/playlist.interface';
import { Tag, TrainedModel } from 'src/app/interfaces/model.interface';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  RECOMMEND_URL = environment.RECOMMEND_API_URL;

  constructor(private http: HttpClient) {}

  getModelInformation(modelId: string): Observable<TrainedModel> {
    const url = `${this.RECOMMEND_URL}/models?modelId=${modelId}`;
    return this.http.get<TrainedModel>(url);
  }

  getTagInformation(): Observable<Tag[]> {
    const url = `${this.RECOMMEND_URL}/tags`;
    return this.http.get<Tag[]>(url);
  }
}
