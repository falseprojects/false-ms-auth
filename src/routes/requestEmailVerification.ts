import crypto from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import redisClient from '../lib/redis';
import { userApi } from '../lib/axios';
import { BadRequestError } from './errors/badRequestError';
import { sendEmail } from '../services/emailHandler';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

export async function requestEmailVerification(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/auth/requesEmailVerification', {
      schema: {
        tags: ['auth'],
        summary: 'Solicitar verificação de e-mail',
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
        try {
          const { email } = request.body;

          // Verificar se o e-mail está cadastrado
          const user = await userApi.post('/user/getByEmail', { email: email });

          if (user.status === 400) {
            throw new BadRequestError('User does not exist');
          }

          // Gerar o token de verificação
          const verificationToken = crypto.randomBytes(32).toString('hex');

          // Armazenar o token no Redis com expiração de 5 minutos
          await redisClient.set(
            `emailVerification:${verificationToken}`,
            user.data.user_id.toString(),
            {
              EX: 300, // Expira em 300 segundos (5 minutos)
            }
          );
          const frontendPath = process.env.FRONTEND_PATH_VERIFY_EMAIL;
          // Enviar o e-mail de verificação
          const verificationLink = `${frontendPath}?token=${verificationToken}`;

          await sendEmail(
            email,
            'Verifique seu endereço de e-mail',
            `Por favor, clique no link a seguir para verificar seu e-mail: ${verificationLink}`
          );

          return reply
            .status(200)
            .send({ message: 'E-mail de verificação enviado com sucesso.' });
        } catch (error) {
          if (error instanceof Error) {
            console.log(Error);
          }
        }
      },
    });
}
