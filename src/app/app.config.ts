import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { SocketIoModule } from 'ngx-socket-io';
import { authInterceptor } from './auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
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
