import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import redisClient from '../lib/redis';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function verifyTokenEmail(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/auth/verifyTokenEmail', {
    schema: {
      tags: ['auth'],
      summary: 'Verificar o e-mail do usuário',
      querystring: z.object({
        token: z.string(),
      }),
      response: {
        200: z.object({
          message: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { token } = request.query;

      // Recuperar o user_id associado ao token
      const isTokenExpired = await redisClient.get(
        `emailVerification:${token}`
      );

      if (!isTokenExpired) {
        return reply
          .status(400)
          .send({ message: 'Token inválido ou expirado.' });
      }

      // Atualizar o campo verified_email para true no endpoint

      // Remover o token do Redis
      await redisClient.del(`emailVerification:${token}`);

      // Retornar uma resposta em JSON
      return reply
        .status(200)
        .send({ message: 'E-mail verificado com sucesso!' });
    },
  });
}
