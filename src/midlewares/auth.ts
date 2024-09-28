import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { UnauthorizedError } from '../routes/errors/unauthorized-error';

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.addHook('preHandler', async (request) => {
    request.getCurrentUser = async () => {
      try {
        const { sub } = await request.jwtVerify<{ sub: object }>();
        return sub;
      } catch (error) {
        throw new UnauthorizedError('Invalid auth token');
      }
    };
  });
});
