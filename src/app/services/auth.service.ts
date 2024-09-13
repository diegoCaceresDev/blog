import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  checkToken(token: string): Observable<any> {
    return this.http.post('/api/auth/validate-token', { token });
  }
}
