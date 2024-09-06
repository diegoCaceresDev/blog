import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule } from 'ngx-socket-io';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      SocketIoModule.forRoot({
        url: 'http://localhost:3000', // URL sin token
        options: { transports: ['websocket'] }, // Sin token aquí
      })
    ),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
  ],
};
