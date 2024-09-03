import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Post } from '../models/post.model';
import { CreatePostDto } from '../models/create-post.dto';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

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

  getUserPosts(userId: number, token: string): Observable<Post[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<Post[]>(`${this.apiUrl}/posts/user/${userId}`, {
      headers,
    });
  }
  validateToken(): Observable<{ valid: boolean }> {
    const token = localStorage.getItem('token'); // Recupera el token del localStorage

    if (!token) {
      // Manejo del caso en que el token no está disponible
      return of({ valid: false });
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<{ valid: boolean }>(
      `${this.apiUrl}/auth/validate-token`,
      { token }, // Envía el token en el cuerpo de la solicitud
      { headers }
    );
  }

  deletePost(postId: number, token: string): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/posts/${postId}`, {
      headers,
    });
  }
}
