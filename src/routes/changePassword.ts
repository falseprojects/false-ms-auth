import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { hash } from 'bcryptjs';
import redisClient from '../lib/redis';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { userApi } from '../lib/axios';
import { BadRequestError } from './errors/badRequestError';

export async function changePassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/changePassword', {
    schema: {
      tags: ['auth'],
      summary: 'Redefinir senha',
      body: z.object({
        token: z.string(),
        password: z.string().min(6),
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
      const { token, password } = request.body;

      const userId = await redisClient.get(`passwordReset:${token}`);

      if (!userId) {
        return reply
          .status(400)
          .send({ message: 'Token inválido ou expirado.' });
      }

      const passwordHash = await hash(password, 6);

      const changedPassword = await userApi.put(
        `/user/update/${Number(userId)}`,
        {
          password_hash: passwordHash,
        }
      );

      if (!changedPassword) {
        throw new BadRequestError(
          'Not possibel to change password, try again later'
        );
      }

      await redisClient.del(`passwordReset:${token}`);

      return reply
        .status(200)
        .send({ message: 'Senha atualizada com sucesso!' });
    },
  });
}
