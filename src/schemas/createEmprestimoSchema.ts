// src/schemas/createEmprestimoSchema.ts
import { z } from "zod";

export const createEmprestimoSchema = z.object({
  usuarioId: z.string().min(1, "Selecione um usuário"),
  livroId: z.string().min(1, "Selecione um livro"),
  dataInicio: z.string().min(1, "Informe a data de início"),
  dataPrevistoDevolucao: z.string().min(1, "Informe a data prevista de devolução"),
  status: z.enum(["emprestado", "devolvido"], {
    required_error: "Selecione um status",
  }),
});

// Inferência de tipo para usar com React
export type CreateEmprestimoFormData = z.infer<typeof createEmprestimoSchema>;
