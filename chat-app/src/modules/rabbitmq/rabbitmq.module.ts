import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { RabbitProducer } from './producer.service';
import { RabbitConsumer } from './consumer.service';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [RabbitConsumer],
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'MESSAGE_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: configService.getOrThrow<string>('RABBITMQ_QUEUE'),
            queueOptions: {
              durable: true,
            },
            noAck: true,
            prefetchCount: 1,
          },
        }),
      },
    ]),
    forwardRef(() => MessageModule),
  ],
  providers: [RabbitProducer, RabbitConsumer],
  exports: [RabbitProducer, RabbitConsumer],
})
export class RabbitMQModule {}
