import fastifyCors from '@fastify/cors';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { fastifyHelmet } from '@fastify/helmet';
import fastifyMultipart from '@fastify/multipart';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
      trustProxy: true,
      ignoreTrailingSlash: true,
      disableRequestLogging: true,
    }),
  );

  await app.register(fastifyMultipart);
  await app.register(fastifyCors, { credentials: true, origin: '*' });
  await app.register(fastifyHelmet, { contentSecurityPolicy: false });
  await app.listen(process.env.SERVER_PORT, '0.0.0.0');
  console.log(`server is running on: ${await app.getUrl()}`);
}
bootstrap();
