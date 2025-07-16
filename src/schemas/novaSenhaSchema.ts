import { z } from "zod";

export const novaSenhaSchema = z
  .object({
    novaSenha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type NovaSenhaSchema = z.infer<typeof novaSenhaSchema>;