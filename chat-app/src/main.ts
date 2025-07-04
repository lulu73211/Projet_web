import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173', // autorise ton front vite
    credentials: true,               // si tu veux autoriser cookies/headers auth
  });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
      queue: configService.getOrThrow<string>('RABBITMQ_QUEUE'),
      queueOptions: {
        durable: true,
        exclusive: false,
        autoDelete: false,
      },
      noAck: true,
      prefetchCount: 1,
    },
  };

  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      microserviceOptions,
    );

  logger.log('DATABASE_URL:', process.env.DATABASE_URL);
  logger.log('REDIS_URL:', process.env.REDIS_HOST, process.env.REDIS_PORT);
  logger.log('RABBITMQ_URL:', process.env.RABBITMQ_URL);

  logger.log('Starting RabbitMQ microservice...');
  await microservice.listen();
  logger.log('RabbitMQ microservice is running');

  logger.log('Starting HTTP server...');
  await app.listen(3000);
  logger.log('Application is running on: http://localhost:3000');
}
bootstrap();
