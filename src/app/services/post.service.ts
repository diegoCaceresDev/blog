import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Post } from '../models/post.model';
import { CreatePostDto } from '../models/create-post.dto';
import { environment } from '../../environments/environment'; // Importa el archivo de entorno

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createPost(formData: FormData): Observable<Post> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Token not found. Please log in.'));
    }

    return this.http
      .post<Post>(`${this.apiUrl}/posts`, formData, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error)) // Llamamos a la función con el error completo
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage: string | string[] = 'An unexpected error occurred';

    if (error.error?.message) {
      // Si el servidor envió un array de mensajes, lo usamos tal cual
      errorMessage = Array.isArray(error.error.message)
        ? error.error.message
        : [error.error.message];
    } else if (error.status === 401) {
      errorMessage = ['Unauthorized. Please log in again.'];
    } else if (error.status === 404) {
      errorMessage = ['Resource not found.'];
    }

    // Lanza el error completo para que el componente lo maneje
    return throwError(() => ({ messages: errorMessage, status: error.status }));
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

  getPostById(postId: number): Observable<Post> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Token not found. Please log in.'));
    }

    return this.http
      .get<Post>(`${this.apiUrl}/posts/${postId}`, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      })
      .pipe(catchError(this.handleError));
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

  private getToken(): string | null {
    return localStorage.getItem('token');
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

  reactToPost(
    postId: number,
    reaction: 'like' | 'dislike',
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      type: reaction, // 'like' o 'dislike'
    };

    return this.http.post(`${this.apiUrl}/posts/${postId}/reactions`, body, {
      headers,
    });
  }
}
