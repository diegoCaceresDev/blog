import { User } from './user.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  author?: User;
  imageUrl?: string; // Campo de imagen opcional
  likeCount: number; // Contador de likes
  dislikeCount: number; // Contador de dislikes
  userReaction?: 'like' | 'dislike' | null; // Reacción del usuario (like, dislike o null)
}
