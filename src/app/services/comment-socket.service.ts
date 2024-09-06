import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentSocketService {
  constructor(private socket: Socket) {}

  // Emitir el evento para crear un comentario
  createComment(postId: number, content: string) {
    this.socket.emit('createComment', { postId, content });
  }

  // Escuchar los comentarios creados en tiempo real
  onCommentCreated(): Observable<any> {
    return this.socket.fromEvent('commentCreated');
  }

  // Conectar al servidor de WebSocket
  connect() {
    const token = localStorage.getItem('token'); // Leer el token de localStorage al momento de conectar
    if (token) {
      // Pasar el token como header en cada conexión
      this.socket.ioSocket.io.opts.query = { token }; // Asegurarse de actualizar el token más reciente
      this.socket.connect(); // Conectar solo si el token está disponible
      console.log('WebSocket conectado con token:', token);
    } else {
      console.error('Token no disponible para conectar WebSocket');
    }
  }

  // Desconectar del servidor de WebSocket
  disconnect() {
    this.socket.disconnect();
  }
}
