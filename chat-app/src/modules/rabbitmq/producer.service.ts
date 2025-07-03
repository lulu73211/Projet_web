import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitProducer {
  private readonly logger = new Logger(RabbitProducer.name);

  constructor(@Inject('MESSAGE_SERVICE') private client: ClientProxy) {
    this.logger.log('RabbitProducer initialized');
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('RabbitMQ connection established');
    } catch (error) {
      this.logger.error(`Failed to connect to RabbitMQ: ${error.message}`);
    }
  }

  async publish(pattern: string, data: any) {
    this.logger.log(`Publishing message: ${pattern} ${JSON.stringify(data)}`);
    try {
      return this.client.emit(pattern, data);
    } catch (error) {
      this.logger.error(`Error publishing message: ${error}`);
      throw error;
    }
  }
}
