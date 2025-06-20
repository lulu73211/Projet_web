import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitProducer } from './producer.service';
import { RabbitConsumer } from './consumer.service';
import { MessageModule } from '../message/message.module';

@Module({
  controllers: [RabbitConsumer],
  imports: [
    ClientsModule.register([
      {
        name: 'MESSAGE_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'message_queue',
          queueOptions: {
            durable: true,
          },
          noAck: true,
          prefetchCount: 1,
        },
      },
    ]),
    forwardRef(() => MessageModule),
  ],
  providers: [RabbitProducer, RabbitConsumer],
  exports: [RabbitProducer, RabbitConsumer],
})
export class RabbitMQModule {}
