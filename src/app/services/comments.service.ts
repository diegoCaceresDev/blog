import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'http://localhost:3000/comments';

  constructor(private http: HttpClient) {}

  // Obtener comentarios por postId con el token en la cabecera
  getCommentsByPostId(postId: number, token: string): Observable<any[]> {
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/post/${postId}`, {
      headers,
    });
  }

  // Crear un nuevo comentario
  createComment(postId: number, content: string): Observable<any> {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage

    // Configura las cabeceras con el token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    // Define el cuerpo de la solicitud
    const body = {
      postId,
      content,
    };

    // Realiza la petición POST con las cabeceras y el cuerpo
    return this.http.post<any>(`${this.apiUrl}/create`, body, { headers });
  }
}
