import { FastifyInstance } from 'fastify';
import { login } from './login';
import { register } from './register';

export async function routes(app: FastifyInstance) {
  // Registrar as rotas separadamente
  await login(app);
  await register(app);
}
