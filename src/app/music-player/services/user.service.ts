import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/interfaces/user.interface';

const _user: User = {
  id: 1,
  name: 'admin',
  email: 'admin123@gmail.com',
  password: '123456',
  thumbnail: new URL('abcxyz'),
};

@Injectable()
export class UserService {
  API_BASE_URL = environment.apiMusicUrl;

  constructor(private http: HttpClient) {}

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/api/users/${userId}`);
  }

  // login(account: String): Observable<User> {
  //   return this.http.post<User>(`${this.API_BASE_URL}/api/users`, account);
  // }

  login(account: String): Observable<User> {
    return Observable.create((observer) => {
      observer.next(_user);
      observer.complete();
    });
  }
}
