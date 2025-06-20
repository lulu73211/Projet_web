import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.conversation.findMany({
      include: { users: true, messages: true },
    });
  }

  async getById(id: number) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: { users: true, messages: true },
    });
  }

  async create(usersIds: number[]) {
    return this.prisma.conversation.create({
      data: {
        users: {
          connect: usersIds.map((id) => ({ id })),
        },
      },
      include: { users: true, messages: true },
    });
  }
}
