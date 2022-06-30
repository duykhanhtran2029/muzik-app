import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthHelperService {

  constructor(private http: HttpClient) { }

  getAPIAccessToken() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      client_id: environment.AUTH0_CONFIG.API_CLIENT_ID,
      client_secret: environment.AUTH0_CONFIG.API_CLIENT_SECRET,
      audience: environment.AUTH0_CONFIG.AUDIENCE,
      grant_type: "client_credentials"
    };
    return this.http.post(`${environment.AUTH0_CONFIG.DOMAIN}/oauth/token`, body, { headers });
  }

  getUserRoles(token: string, userId: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(encodeURI(`${environment.AUTH0_CONFIG.DOMAIN}/api/v2/users/${userId}/roles`), { headers: headers });
  }

}
