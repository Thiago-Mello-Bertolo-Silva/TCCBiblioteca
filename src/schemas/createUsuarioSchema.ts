import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E‑mail inválido"),
  telefone: z
    .string()
    .regex(/^\(\d{2}\)\d{5}-\d{4}$/, "Telefone deve estar no formato (00)00000-0000"),
  senha: z.string().min(6, "Mínimo 6 caracteres"),
  cargo: z.enum(["usuario", "admin"]),
});

export type UsuarioFormData = z.infer<typeof usuarioSchema>;
