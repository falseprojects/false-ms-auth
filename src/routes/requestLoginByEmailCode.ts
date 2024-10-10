import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { BadRequestError } from './errors/badRequestError';
import { userApi } from '../lib/axios';
import { sendEmail } from '../services/emailHandler';
import redisClient from '../lib/redis';

export async function requestLoginByEmailCode(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/auth/login/sendCodeEmail', {
    schema: {
      tags: ['auth'],
      summary: 'Send a code to user email for login',
      body: z.object({
        email: z.string().email(),
      }),
      response: {
        400: z.object({
          message: z.string(),
        }),
        200: z.object({
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

      const code = Math.floor(100000 + Math.random() * 900000).toString();

      await redisClient.set(`loginCode:${email}`, code, {
        EX: 900,
      });

      await sendEmail(email, 'Your login code', `Your login code is: ${code}`);

      return reply.status(200).send({ message: 'Code sent to your email.' });
    },
  });
}
