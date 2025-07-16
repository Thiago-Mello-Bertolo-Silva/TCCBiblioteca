import { z } from 'zod';

export const cadastroSchema = z.object({
  nome: z.string().min(1, '*Nome deve ser preenchido!'),
  email: z.string().min(1, '*Email deve ser preenchido!').email('*Email inválido!'),
  telefone: z
    .string()
    .min(14, '*Telefone deve conter 11 dígitos!')
    .regex(/^\(\d{2}\)\d{5}-\d{4}$/, '*Formato de telefone inválido!'),
  senha: z.string().min(6, '*Senha deve ter no mínimo 6 caracteres!'),
  confirmarSenha: z.string().min(1, '*Confirme sua senha!'),
}).refine((data) => data.senha === data.confirmarSenha, {
  path: ['confirmarSenha'],
  message: '*As senhas não coincidem!',
});