// src/schemas/livroSchema.ts
import { z } from "zod";

export const livroSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  categorias: z.string().min(1, "Categorias é obrigatório"),
  autores: z.string().min(1, "Autores é obrigatório"),
  editora: z.string().min(1, "Editora é obrigatória"),
  anoPublicacao: z
    .string()
    .min(4, "Ano inválido")
    .regex(/^\d{4}$/, "Ano deve conter 4 dígitos"),
  edicao: z.string().min(1, "Edição é obrigatória"),
  linkOnline: z.string().url("Link deve ser uma URL válida"),
  disponivel: z.enum(["true", "false"]),
});

export type LivroFormData = z.infer<typeof livroSchema>;
