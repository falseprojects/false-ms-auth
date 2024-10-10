import { FastifyInstance } from 'fastify';
import { login } from './login';
import { register } from './register';
import { verifyEmailCode } from './verifyEmailCode';
import { requestEmailVerification } from './requestEmailVerification';
import { changePassword } from './changePassword';
import { requestChangePassword } from './requestChangePassword';
import { requestLoginByEmailCode } from './requestLoginByEmailCode';
import { verifyTokenEmail } from './verifyTokenEmail';

export async function routes(app: FastifyInstance) {
  // Registrar as rotas separadamente
  await changePassword(app);
  await login(app);
  await register(app);
  await requestChangePassword(app);
  await requestEmailVerification(app);
  await requestLoginByEmailCode(app);
  await verifyEmailCode(app);
  await verifyTokenEmail(app);
}
