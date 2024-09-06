import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { PostService } from './app/services/post.service';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { importProvidersFrom } from '@angular/core';

// const token = localStorage.getItem('token') || '';

// const config: SocketIoConfig = {
//   url: 'http://localhost:3000',
//   options: {
//     transports: ['websocket'],
//     query: {
//       token,
//     },
//   },
// };

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig.providers,
    PostService,
    // importProvidersFrom(SocketIoModule.forRoot(config)),
  ],
}).catch((err) => console.error(err));
