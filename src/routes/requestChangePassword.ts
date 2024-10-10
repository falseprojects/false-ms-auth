import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import redisClient from '../lib/redis';
import { userApi } from '../lib/axios';
import { BadRequestError } from './errors/badRequestError';
import { sendEmail } from '../services/emailHandler';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function requestChangePassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/requestChangePassword', {
    schema: {
      tags: ['auth'],
      summary: 'Solicitar recuperação de senha',
      body: z.object({
        email: z.string().email(),
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
      const { email } = request.body;

      const user = await userApi.post('/user/getByEmail', { email: email });

      if (user.status === 400) {
        throw new BadRequestError('User does not exist');
      }

      const resetToken = crypto.randomBytes(32).toString('hex');

      await redisClient.set(
        `passwordReset:${resetToken}`,
        user.data.user_id.toString(),
        {
          EX: 900,
        }
      );
      const frontendPath = process.env.FRONTEND_PATH_CHANGE_PASSWORD;

      const resetLink = `${frontendPath}?token=${resetToken}`;

      await sendEmail(
        email,
        'Recuperação de Senha',
        `Clique no link para redefinir sua senha: ${resetLink}`
      );

      return reply.status(200).send({
        message: 'Se o e-mail existir, um link de recuperação será enviado.',
      });
    },
  });
}
