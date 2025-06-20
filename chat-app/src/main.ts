import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activer la validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Supprime les propriétés non-whitelistées
      transform: true, // Transforme automatiquement les payloads
      forbidNonWhitelisted: true, // Rejette les requêtes avec des propriétés non-whitelistées
    }),
  );

  await app.listen(3000);
}
bootstrap();
