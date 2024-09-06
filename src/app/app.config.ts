import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

const token = localStorage.getItem('token') || '';

// Configuración del Socket
const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    transports: ['websocket'],
    query: {
      token: token,
    },
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(SocketIoModule.forRoot(config)), // Proveedor de WebSocket

    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
  ],
};
