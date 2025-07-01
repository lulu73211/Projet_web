import {
  Resolver,
  Mutation,
  Args,
  Int,
  Query,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { RabbitProducer } from '../rabbitmq/producer.service';
import { MessageService } from './message.service';
import { MessageEntity } from './entities/message.model';
import { MessagePayload, SendMessageInput } from './dto/message.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { pubSub } from '../redis/pubsub.provider';

@Resolver(() => MessageEntity)
export class MessageResolver {
  private readonly logger = new Logger(MessageResolver.name);

  constructor(
    private readonly rabbit: RabbitProducer,
    private readonly messageService: MessageService,
  ) {}

  @Query(() => [MessageEntity])
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Args('conversationId', { type: () => Int }) conversationId: number,
  ) {
    this.logger.log(`Fetching messages for conversation: ${conversationId}`);
    return this.messageService.getMessages(conversationId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async sendMessage(@Args('input') input: SendMessageInput) {
    this.logger.log(`Sending message: ${JSON.stringify(input)}`);
    try {
      await pubSub.publish('message_send', { messageSend: input });
      await this.rabbit.publish('message_send', input);
      return true;
    } catch (error) {
      this.logger.error(`Error sending message: ${error}`, error.stack);
      throw error;
    }
  }

  @Subscription(() => MessagePayload, {
    name: 'messageSend',
    resolve: (payload) => payload.messageSend,
  })
  messageSend() {
    return pubSub.asyncIterator('message_send');
  }
}
