import { z } from 'zod';

export const recuperacaoSchema = z.object({
  email: z.string()
    .min(1, '*E-mail deve ser preenchido!')
    .email('*E-mail inválido!')
});