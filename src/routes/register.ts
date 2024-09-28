import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { hash } from 'bcryptjs';

export async function register(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/register', {
    schema: {
      tags: ['auth'],
      summary: 'Register a new client',
      body: z.object({
        name: z.string(),
        password: z.string(),
        email: z.string().email(),
      }),
      response: {
        400: z.object({
          message: z.string(),
        }),
        201: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { name, password, email } = request.body;

      //Buscar o usuário pelo email pra ver se ele já existe.
      //Caso o usuário existir, retornar um erro.

      //Fazer o encrypt da senha
      const passwordHash = await hash(password, 6);

      //Fazer a chamada da api de usuários para realizar a criação do usuário.

      //Aguardar a resposta da api de usuarios e confirmar o registro.
    },
  });
}
