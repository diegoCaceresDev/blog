export interface CreatePostDto {
  title: string;
  content: string;
  image?: File; // Añadimos el campo de imagen opcional
}
