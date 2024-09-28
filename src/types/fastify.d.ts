import 'fastify';

import { Member, Organization } from '@prisma/client';

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUser(): Promise<object>;
  }
}
