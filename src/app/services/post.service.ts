import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Post } from '../models/post.model';
import { CreatePostDto } from '../models/create-post.dto';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'https://api.diegocaceres.online';

  constructor(private http: HttpClient) {}

  createPost(formData: FormData): Observable<Post> {
    const token = localStorage.getItem('token'); // Asegúrate de tener el token disponible

    return this.http.post<Post>(`${this.apiUrl}/posts`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  // Servicio para actualizar el post con una imagen
  updatePost(
    postId: number,
    formData: FormData,
    token: string
  ): Observable<Post> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Post>(`${this.apiUrl}/posts/${postId}`, formData, {
      headers,
    });
  }

  getAllPosts(
    page: number = 1,
    limit: number = 10,
    token: string // Añadido para recibir el token
  ): Observable<{ posts: Post[]; total: number }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ posts: Post[]; total: number }>(
      `${this.apiUrl}/posts?page=${page}&limit=${limit}`,
      { headers } // Incluye los encabezados con el token
    );
  }

  getPostById(postId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/posts/${postId}`, { headers });
  }

  getUserPosts(
    userId: number,
    page: number = 1,
    limit: number = 10,
    token: string // Añadido para recibir el token
  ): Observable<{ posts: Post[]; total: number }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<{ posts: Post[]; total: number }>(
      `${this.apiUrl}/posts/user/${userId}?page=${page}&limit=${limit}`,
      { headers } // Incluye los encabezados con el token
    );
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
