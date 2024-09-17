import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RegisterDto } from '../models/register.dto';
import { LoginDto } from '../models/login.dto';
import { CreatePostDto } from '../models/create-post.dto';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { CommentSocketService } from './comment-socket.service';

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
  private apiUrl = 'https://api.diegocaceres.online';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private webSocketService: CommentSocketService
  ) {
    const token = localStorage.getItem('token');
    this.checkToken(token); // Verifica el token al iniciar el servicio
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
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
            this.webSocketService.connect(); // Reconectar WebSocket con el nuevo token
          }
        }),
        catchError((error) => {
          console.error('Login error:', error);
          return throwError(error);
        })
      );
  }

  createPost(createPostDto: CreatePostDto): Observable<Post> {
    return this.http
      .post<Post>(`${this.apiUrl}/posts`, createPostDto, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Create post error:', error);
          return throwError(error);
        })
      );
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getUserData(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/me`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Get user data error:', error);
          return throwError(error);
        })
      );
  }

  getUserByEmail(email: string): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/users/email/${email}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        catchError((error) => {
          console.error('Get user by email error:', error);
          return throwError(error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.updateAuthenticationStatus(false);
    this.webSocketService.disconnect(); // Desconectar WebSocket al hacer logout
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
        { token },
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
  private updateAuthenticationStatus(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }
}
