import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { SocketIoModule } from 'ngx-socket-io';
import { authInterceptor } from './auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { ErrorInterceptor } from './error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    importProvidersFrom(
      SocketIoModule.forRoot({
        url: environment.apiUrl, // URL sin token
        options: { transports: ['websocket'] }, // Sin token aquí
      })
    ),
    provideAnimationsAsync(),
    importProvidersFrom(HttpClientModule),
  ],
};
