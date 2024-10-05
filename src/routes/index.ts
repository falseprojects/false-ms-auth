import { FastifyInstance } from 'fastify';
import { login } from './login';
import { register } from './register';
import { sendCodeEmail } from './sendCodeToEmail';
import { verifyEmailCode } from './verifyEmailCode';

export async function routes(app: FastifyInstance) {
  // Registrar as rotas separadamente
  await login(app);
  await register(app);
  await sendCodeEmail(app);
  await verifyEmailCode(app);
}
