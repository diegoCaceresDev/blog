import { User } from './user.model';

export interface Post {
  id: number;
  title: string;
  content: string;
  author?: User;
  imageUrl?: string; // Añadimos el campo de imagen opcional
}
