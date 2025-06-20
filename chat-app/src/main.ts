import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Créer une application hybride (HTTP + Microservices)
  const app = await NestFactory.create(AppModule);

  // Activer la validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non-whitelistées
      transform: true, // Transforme automatiquement les payloads
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non-whitelistées
    }),
  );

  // Configuration du microservice RabbitMQ
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@localhost:5672'],
      queue: 'message_queue',
      queueOptions: {
        durable: true, // préférable pour persister
        exclusive: false, // doit être false sauf si queue privée
        autoDelete: false, // idem
      },
      noAck: true,
      prefetchCount: 1,
    },
  };

  // Créer une application microservice distincte
  const microservice =
    await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      microserviceOptions,
    );

  logger.log('Starting RabbitMQ microservice...');
  await microservice.listen();
  logger.log('RabbitMQ microservice is running');

  logger.log('Starting HTTP server...');
  await app.listen(3000);
  logger.log('Application is running on: http://localhost:3000');
}
bootstrap();
