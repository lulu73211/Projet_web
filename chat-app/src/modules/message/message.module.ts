import { forwardRef, Module } from '@nestjs/common';
import { MessageResolver } from './message.resolver';
import { MessageService } from './message.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule, forwardRef(() => RabbitMQModule)],
  providers: [MessageResolver, MessageService],
  exports: [MessageService],
})
export class MessageModule {}
