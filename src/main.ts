import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { PostService } from './app/services/post.service';

bootstrapApplication(AppComponent, {
  providers: [...appConfig.providers, PostService],
}).catch((err) => console.error(err));
