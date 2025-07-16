import { z } from "zod";

export const emprestimoSchema = z.object({
  usuarioId: z
    .number({ invalid_type_error: "Usuário é obrigatório" })
    .positive("Usuário inválido"),
  livroId: z
    .number({ invalid_type_error: "Livro é obrigatório" })
    .positive("Livro inválido"),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataPrevistoDevolucao: z.string().min(1, "Data de devolução é obrigatória"),
  status: z.enum(["emprestado", "devolvido"]),
});

export type EmprestimoFormData = z.infer<typeof emprestimoSchema>;
