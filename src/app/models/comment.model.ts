// comment.model.ts
export interface Comment {
  id: number;
  content: string;
  author: {
    nombre: string;
  };
  createdAt: Date; // Asegúrate de que esto esté en el formato correcto
}
