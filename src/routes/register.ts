import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { hash } from 'bcryptjs';
import { userApi } from '../lib/axios';
import { BadRequestError } from './errors/badRequestError';

export async function register(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/register', {
    schema: {
      tags: ['auth'],
      summary: 'Register a new client',
      body: z.object({
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
      const { password, email } = request.body;

      try {
        const passwordHash = await hash(password, 6);

        const createdUser = await userApi.post('/user/create', {
          email: email,
          password_hash: passwordHash,
        });

        if (createdUser.status === 400) {
          throw new BadRequestError('Error trying to create user');
        }
        return reply.status(200).send();
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    },
  });
}
