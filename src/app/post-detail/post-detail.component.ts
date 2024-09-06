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

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private commentSocketService: CommentSocketService // Servicio WebSocket
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token') || 'no tengo el token';
    // Conectar al WebSocket después de cargar el post y tener el token
    if (this.token) {
      this.commentSocketService.connect(); // El token ya está en el servicio
    }
    this.route.paramMap.subscribe((params) => {
      const postId = +params.get('id')!;
      this.loadPost(postId);
    });
  }

  loadPost(postId: number): void {
    this.postService.getPostById(postId, this.token).subscribe(
      (post: Post) => {
        this.post = post;
        this.loadComments(postId); // Cargar los comentarios cuando el post esté disponible

        this.commentSocketService.onCommentCreated().subscribe((newComment) => {
          this.comments.push(newComment); // Añadir el nuevo comentario al array de comentarios
        });
      },
      (error) => {
        console.error('Error fetching post:', error);
      }
    );
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
    }
  }

  ngOnDestroy(): void {
    // Desconectar del WebSocket al destruir el componente
    this.commentSocketService.disconnect();
  }
}
