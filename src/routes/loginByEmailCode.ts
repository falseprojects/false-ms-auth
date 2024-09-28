import { compare, hash } from 'bcryptjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequestError } from './errors/badRequestError';
import { UnauthorizedError } from './errors/unauthorized-error';

export async function login(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/login/email', {
    schema: {
      tags: ['auth'],
      summary: 'Login a costumer by code sent to email',
      body: z.object({
        email: z.string().email(),
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
      const userDb = {
        id: 1,
        role: 'customer',
        email: 'lucascv8525@gmail.com',
        password: '123',
      };

      const hashed = await hash(userDb.password, 6);
      const { email } = request.body;

      if (!userDb) {
        throw new BadRequestError('User does not exist');
      }

      //Montar o email com o codigo random.

      //Enviar o email

      //Validar se o codigo recebido for o mesmo

      const token = await reply.jwtSign(
        {
          sub: { id: userDb.id, role: userDb.role, email: userDb.email },
        },
        {
          sign: {
            expiresIn: '3d',
          },
        }
      );

      return reply.status(201).send({ token });
    },
  });
}
