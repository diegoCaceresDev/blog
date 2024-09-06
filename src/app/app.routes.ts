import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PostComponent } from './post/post.component';
import { AuthGuard } from './auth.guard'; // Importa el AuthGuard
import { PostDetailComponent } from './post-detail/post-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: PostComponent,
    canActivate: [AuthGuard],
  },
  { path: 'post/:id', component: PostDetailComponent },

  { path: '**', redirectTo: '/login' }, // Redirige cualquier ruta desconocida al login
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ruta por defecto
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
