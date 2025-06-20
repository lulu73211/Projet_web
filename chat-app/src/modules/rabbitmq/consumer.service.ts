import { Controller, Inject, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MessageService } from '../message/message.service';
import { SendMessageInput } from '../message/dto/message.dto';

@Controller()
export class RabbitConsumer {
  private readonly logger = new Logger(RabbitConsumer.name);

  constructor(
    @Inject()
    private readonly messageService: MessageService,
  ) {
    this.logger.log('RabbitConsumer loaded');
  }

  @EventPattern('message_send')
  async handleSendMessage(@Payload() data: SendMessageInput) {
    this.logger.log(`[Worker] Received message: ${JSON.stringify(data)}`);
    try {
      const result = await this.messageService.handleIncoming(data);
      this.logger.log(`Message processed successfully: ${result.id}`);

      await this.messageService.saveMessage(data);
      return result;
    } catch (error) {
      this.logger.error(
        `Error processing message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
