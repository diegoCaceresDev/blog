import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/confirm-dialog-component/confirm-dialog-component.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Post } from '../models/post.model';
import { MatIconModule } from '@angular/material/icon'; // Asegúrate de importar MatIconModule
import { ApiService } from '../services/api.service';
import { User } from '../models/user.model';
import { MatPaginatorModule } from '@angular/material/paginator'; // Importa MatPaginatorModule
import { environment } from '../../environments/environment'; // Importa el archivo de entorno
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatPaginatorModule,
    RouterModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  totalPosts: number = 0;
  selectedImage: File | null = null; // Para manejar la imagen seleccionada

  postForm!: FormGroup;
  token: string = '';
  userId: number = 0;
  userName: string = '';
  userRole: string = '';
  userLastName: string = '';
  selectedOption: string = 'all';
  page: number = 1;
  limit: number = 10;
  apiUrl = environment.apiUrl;
  loading = false;

  likeCount: number = 0;
  dislikeCount: number = 0;
  userReaction: 'like' | 'dislike' | null = null;

  constructor(
    private postService: PostService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private apiService: ApiService, // Asegúrate de tener un servicio para obtener información del usuario
    private cdr: ChangeDetectorRef // Inyecta el servicio ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || '';
    const userIdFromStorage = localStorage.getItem('userId');
    this.userId = userIdFromStorage ? +userIdFromStorage : 0; // Usa 0 si userIdFromStorage es null
    this.initializeForm();

    if (!this.token || !this.userId) {
      this.router.navigate(['/login']); // Redirige al login si no hay token o userId
      return;
    }
    this.getUserData();
    this.getPosts();
  }

  initializeForm(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      image: [''], // Campo para la imagen
    });
  }

  getUserData(): void {
    this.apiService.getUserData().subscribe(
      (user: User) => {
        this.userName = user.nombre;
        this.userLastName = user.apellido;
        this.userRole = user.role;
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }

  getPosts(): void {
    if (this.selectedOption === 'user' && this.userId) {
      this.postService
        .getUserPosts(this.userId, this.page, this.limit, this.token)
        .subscribe(
          (data) => {
            this.posts = data.posts;
            this.totalPosts = data.total;
          },
          (error) => {
            console.error('Error al obtener los posts del usuario', error);
          }
        );
    } else {
      this.postService.getAllPosts(this.page, this.limit, this.token).subscribe(
        (data) => {
          this.posts = data.posts;
          this.totalPosts = data.total;
        },
        (error) => {
          console.error('Error al obtener todos los posts', error);
        }
      );
    }
  }

  onSelectionChange(value: string): void {
    this.selectedOption = value;
    this.page = 1; // Reset page when changing the filter
    this.getPosts();
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.limit = event.pageSize;
    this.getPosts();
  }

  // Método para manejar la selección de archivos
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file; // Guarda la imagen seleccionada
    }
  }

  createPost(): void {
    if (this.postForm.valid) {
      this.loading = true;

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        panelClass: 'custom-dialog-container',
        data: {
          title: 'Crear Post',
          message: '¿Estás seguro de que deseas crear este post?',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const formData = new FormData(); // Usamos FormData para enviar archivos
          formData.append('title', this.postForm.get('title')?.value);
          formData.append('content', this.postForm.get('content')?.value);
          if (this.selectedImage) {
            formData.append('image', this.selectedImage); // Añadimos la imagen si está seleccionada
          }

          this.postService.createPost(formData).subscribe(
            (post: Post) => {
              this.loading = false;

              this.posts.push(post);

              // Reinicia el formulario q
              this.postForm.reset({
                title: '',
                content: '',
                image: '',
              });

              // Marca los controles como limpios y sin toques
              this.postForm.get('title')?.setErrors(null);
              this.postForm.get('content')?.setErrors(null);
              this.postForm.get('image')?.setErrors(null);

              this.postForm.markAsPristine();
              this.postForm.markAsUntouched();

              this.snackBar.open('Post creado exitosamente', 'Cerrar', {
                duration: 5000,
                panelClass: ['green-snackbar'],
              });
            },
            (error) => {
              this.loading = false;
              console.log(error);

              this.handleError(error);
            }
          );
        }
      });
    }
  }

  deletePost(postId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.postService.deletePost(postId, this.token).subscribe(
          () => {
            this.posts = this.posts.filter((post) => post.id !== postId);
            this.snackBar.open('Post eliminado exitosamente', 'Cerrar', {
              duration: 5000,
              panelClass: ['green-snackbar'],
            });
          },
          (error) => {
            console.error('Error al eliminar el post', error);
            this.snackBar.open('Error al eliminar el post', 'Cerrar', {
              duration: 5000,
            });
          }
        );
      }
    });
  }

  onReactToPost(post: Post, reaction: 'like' | 'dislike') {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para reaccionar.');
      return;
    }

    this.postService.reactToPost(post.id, reaction, token).subscribe({
      next: (response: any) => {
        console.log('Respuesta completa del backend:', response);

        const updatedPost = response.data; // Extrae los datos desde "data"
        post.likeCount = updatedPost.likeCount;
        post.dislikeCount = updatedPost.dislikeCount;
        post.userReaction = reaction; // Actualiza la reacción del usuario actual
      },
      error: (err) => {
        console.error('Error al reaccionar al post:', err);
        this.snackBar.open(
          'Ocurrió un error al intentar reaccionar.',
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['red-snackbar'],
          }
        );
      },
      complete: () => {
        this.cdr.markForCheck();
        console.log('Reacción procesada correctamente');
      },
    });

    console.log(post);
  }

  handleError(error: any): void {
    // Asegúrate de que `error.messages` contenga los mensajes esperados
    const messages: string[] = error?.messages || [
      'An unexpected error occurred',
    ];

    // Muestra cada mensaje en un snackBar
    messages.forEach((message) => {
      this.snackBar.open(message, 'Cerrar', {
        duration: 5000,
        panelClass: ['red-snackbar'],
      });
    });
  }
}
