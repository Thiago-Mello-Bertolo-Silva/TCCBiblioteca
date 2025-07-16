// src/schemas/editLivroSchema.ts
import { z } from "zod";

export const editLivroSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  autor: z.string().min(1, "O autor é obrigatório"),
  anoPublicacao: z
    .string()
    .min(4, "Ano inválido")
    .regex(/^\d{4}$/, "Ano deve ter 4 dígitos"),
  editora: z.string().optional(),
  linkOnline: z.string().url("Insira um link válido").optional().or(z.literal("")),
  disponivel: z.enum(["Sim", "Não"]),
});

export type EditLivroFormData = z.infer<typeof editLivroSchema>;
