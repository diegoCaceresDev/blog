import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentSocketService {
  constructor(private socket: Socket) {}

  // Conectar al servidor de WebSocket
  connect() {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    if (token) {
      this.socket.ioSocket.io.opts.query = { token }; // Configurar el token en la consulta
      this.socket.connect(); // Conectar solo si el token está disponible
    } else {
      console.error('Token no disponible para conectar WebSocket');
    }
  }

  // Emitir el evento para crear un comentario
  createComment(postId: number, content: string) {
    if (!postId || !content || content.trim().length < 10) {
      console.error(
        'Invalid comment data: Post ID and content are required, and content must be at least 10 characters.'
      );
      alert('El comentario debe tener al menos 10 caracteres.');
      return;
    }
    this.socket.emit('createComment', { postId, content });
  }

  onError(): Observable<string> {
    return this.socket.fromEvent<string>('error');
  }

  // Escuchar los comentarios creados en tiempo real
  onCommentCreated(): Observable<any> {
    return this.socket.fromEvent('commentCreated');
  }

  // Desconectar del servidor de WebSocket
  disconnect() {
    this.socket.disconnect();
  }
}

// import { Injectable } from '@angular/core';
// import { Socket, SocketIoConfig } from 'ngx-socket-io';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class CommentSocketService extends Socket {
//   constructor() {
//     super({
//       url: 'http://localhost:3000', // URL del servidor WebSocket
//       options: {
//         transports: ['websocket'],
//       },
//     });
//   }

//   // Conectar al servidor WebSocket con token
//   connectWithToken() {
//     const token = localStorage.getItem('token'); // Obtener el token del localStorage
//     if (token) {
//       this.ioSocket.io.opts.query = {
//         token, // Agregar el token a la consulta de la conexión
//       };
//       this.connect(); // Establecer la conexión
//     } else {
//       console.error('Token no disponible para conectar WebSocket');
//     }
//   }

//   // Emitir el evento para crear un comentario
//   createComment(postId: number, content: string) {
//     this.emit('createComment', { postId, content });
//   }

//   // Escuchar los comentarios creados en tiempo real
//   onCommentCreated(): Observable<any> {
//     return this.fromEvent('commentCreated');
//   }

//   // Desconectar del servidor WebSocket
//   disconnectSocket() {
//     this.disconnect();
//     console.log('WebSocket desconectado');
//   }
// }
