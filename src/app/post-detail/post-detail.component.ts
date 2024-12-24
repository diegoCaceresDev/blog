import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommentSocketService } from '../services/comment-socket.service'; // Importar servicio WebSocket
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommentService } from '../services/comments.service';
import { formatDistanceToNow } from 'date-fns'; // Importar date-fns
import { environment } from '../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post!: Post;
  comments: any[] = [];
  commentForm: FormGroup;
  token: string = '';
  editForm: FormGroup; // Formulario para editar el post
  isEditing: boolean = false; // Estado de edición
  selectedImage: File | null = null; // Para manejar la imagen seleccionada
  apiUrl = environment.apiUrl;
  userId: number = 0;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private commentSocketService: CommentSocketService, // Servicio WebSocket
    private snackBar: MatSnackBar // Inyectar MatSnackBar
  ) {
    this.commentForm = this.fb.group({
      content: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(300),
        ],
      ],
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      imageUrl: [''], // Campo para la imagen (puede no ser obligatorio)
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const userIdFromStorage = localStorage.getItem('userId');
    this.userId = userIdFromStorage ? +userIdFromStorage : 0;

    this.token = token !== null ? token : '';

    if (this.token) {
      this.commentSocketService.connect();

      this.commentSocketService
        .onCommentCreated()
        .subscribe((newComment: any) => {
          this.comments.unshift(newComment);
        });

      this.commentSocketService.onError().subscribe((error) => {
        this.snackBar.open(error, 'Cerrar', {
          duration: 5000,
          panelClass: ['red-snackbar'],
        });
      });
    }

    this.route.paramMap.subscribe((params) => {
      const postId = +params.get('id')!;
      this.loadPost(postId);
    });
  }

  loadPost(postId: number): void {
    this.postService.getPostById(postId).subscribe(
      (post: Post) => {
        this.post = post;
        this.loadComments(postId);
      },
      (error) => {
        console.error('Error fetching post:', error);
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file; // Guarda la imagen seleccionada
    }
  }

  // Activar el modo de edición
  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      // Establecer valores actuales del post en el formulario
      this.editForm.patchValue({
        title: this.post.title,
        content: this.post.content,
      });
    }
  }

  // Actualizar el post
  updatePost(): void {
    if (this.editForm.valid) {
      const updatedPost = this.editForm.value;

      // Crear un objeto FormData para enviar tanto el post como la imagen
      const formData = new FormData();
      formData.append('title', updatedPost.title);
      formData.append('content', updatedPost.content);

      // Si se seleccionó una imagen, agregarla al FormData
      if (this.selectedImage) {
        formData.append('image', this.selectedImage);
      }

      this.postService
        .updatePost(this.post.id, formData, this.token)
        .subscribe({
          next: (response) => {
            this.post = response;
            this.isEditing = false; // Desactivar el modo edición después de actualizar
          },
          error: (error) => {
            console.error('Error updating post:', error);
          },
          complete: () => {
            console.log('Post update complete');
          },
        });
    }
  }

  loadComments(postId: number): void {
    this.commentService.getCommentsByPostId(postId, this.token).subscribe(
      (comments) => {
        this.comments = comments;
      },
      (error) => {
        console.error('Error fetching comments:', error);
      }
    );
  }

  submitComment(): void {
    if (this.commentForm.valid) {
      const content = this.commentForm.get('content')?.value;
      const postId = this.post.id;
      this.commentSocketService.createComment(postId, content);
      this.commentForm.reset(); // Limpiar el formulario después de enviar el comentario
    } else {
      this.snackBar.open(
        'El comentario debe tener al menos 1 caracteres.',
        'Cerrar',
        {
          duration: 5000,
          panelClass: ['red-snackbar'],
        }
      );
    }
  }

  ngOnDestroy(): void {
    // Desconectar del WebSocket al destruir el componente
    this.commentSocketService.disconnect();
  }

  // Método para obtener el tiempo relativo
  getRelativeTime(date: Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }
}
