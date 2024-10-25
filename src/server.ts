import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastifyJwt from '@fastify/jwt';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import 'dotenv/config';
import { errorHandler } from './routes/errors/errorHandling';
import { routes } from './routes';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.setErrorHandler(errorHandler);

const PORT = process.env.SERVER_PORT;

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: '',
      description: '',
      version: '',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
});

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
});
app.register(fastifyCors);
app.register(routes);
app.listen({ port: PORT }).then(() => {
  console.log('Server is running: ' + PORT);
});
