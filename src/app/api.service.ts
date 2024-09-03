import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { CreatePostDto } from './models/create-post.dto';
import { Post } from './models/post.model';
import { User } from './models/user.model';

interface TokenResponse {
  token: string;
}

interface ValidationResponse {
  valid: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
  }

  register(registerData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/register`, registerData)
      .pipe(
        catchError((error) => {
          console.error('Registration error:', error);
          return throwError(error);
        })
      );
  }

  login(loginDto: LoginDto): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/auth/login`, loginDto, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap((response: any) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.updateAuthenticationStatus(true);
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  createPost(createPostDto: CreatePostDto, token: string): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, createPostDto, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getUserData(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/email/${email}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.updateAuthenticationStatus(false);
  }

  checkToken(token: string | null): void {
    if (token) {
      this.validateToken(token).subscribe();
    } else {
      this.updateAuthenticationStatus(false);
    }
  }

  validateToken(token: string): Observable<ValidationResponse> {
    return this.http
      .post<ValidationResponse>(
        `${this.apiUrl}/auth/validate-token`,
        { token }, // Enviar el token en el cuerpo de la solicitud
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        tap((response) => {
          this.updateAuthenticationStatus(response.valid);
        }),
        catchError((error) => {
          console.error('Token validation error:', error);
          this.updateAuthenticationStatus(false);
          return throwError(error);
        })
      );
  }

  // Método para actualizar el estado de autenticación
  updateAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
