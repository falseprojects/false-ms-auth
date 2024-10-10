import { compare, hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequestError } from './errors/badRequestError';
import { UnauthorizedError } from './errors/unauthorized-error';
import { userApi } from '../lib/axios';

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/login', {
    schema: {
      tags: ['auth'],
      summary: 'Login by email and password',
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      }),
      response: {
        400: z.object({
          message: z.string(),
        }),
        201: z.object({
          token: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { email, password } = request.body;

      try {
        const user = await userApi.post('/user/getByEmail', { email: email });

        if (user.status === 400) {
          throw new BadRequestError('User does not exist');
        }

        const isPasswordOk = await compare(password, user.data.password_hash);

        if (!isPasswordOk) {
          throw new UnauthorizedError('Password id not correct');
        }

        const token = await reply.jwtSign(
          {
            sub: { id: user.data.user_id, email: user.data.email },
          },
          {
            sign: {
              expiresIn: '3d',
            },
          }
        );

        return reply.status(201).send({ token });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
        }
      }
    },
  });
}
