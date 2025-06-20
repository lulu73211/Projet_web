import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SendMessageInput } from './dto/message.dto';

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private prisma: PrismaService) {}

  async saveMessage(data: SendMessageInput) {
    this.logger.log(`Saving message: ${JSON.stringify(data)}`);
    try {
      return await this.prisma.message.create({
        data: {
          content: data.content,
          author: { connect: { id: data.authorId } },
          conversation: { connect: { id: data.conversationId } },
        },
        include: {
          author: true,
          conversation: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error saving message: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMessages(conversationId: number) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        author: true,
      },
    });
  }

  async handleIncoming(payload: SendMessageInput) {
    this.logger.log(`Handling incoming message: ${JSON.stringify(payload)}`);
    try {
      const message = await this.saveMessage(payload);
      // Tu peux publier via GraphQL PubSub ici si besoin
      return message;
    } catch (error) {
      this.logger.error(
        `Error handling incoming message: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
