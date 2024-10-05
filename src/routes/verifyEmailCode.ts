import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequestError } from './errors/badRequestError';
import { userApi } from '../lib/axios';
import redisClient from '../lib/redis';

export async function verifyEmailCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/login/verifyEmailCode', {
    schema: {
      tags: ['auth'],
      summary: 'Verify the code sent to email and generate jwt',
      body: z.object({
        email: z.string().email(),
        code: z.string(),
      }),
      response: {
        200: z.object({
          token: z.string(),
        }),
        400: z.object({
          message: z.string(),
        }),
      },
    },
    handler: async (request, reply) => {
      const { email, code } = request.body;

      const storedCode = await redisClient.get(`loginCode:${email}`);

      if (!storedCode) {
        return reply.status(400).send({ message: 'Expired code' });
      }

      if (storedCode !== code) {
        return reply.status(400).send({ message: 'Invalid code.' });
      }

      const user = await userApi.post('/user/getByEmail', { email: email });

      if (user.status === 400) {
        throw new BadRequestError('User does not exist');
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

      await redisClient.del(`loginCode:${email}`);

      return reply.status(200).send({ token });
    },
  });
}
