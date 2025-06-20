import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { RabbitMQModule } from './modules/rabbitmq/rabbitmq.module';
import { MessageModule } from './modules/message/message.module';

import { PrismaModule } from 'prisma/prisma.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ConversationModule } from './modules/conversation/conversation.module';

@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    UserModule,
    PrismaModule,
    RabbitMQModule,
    MessageModule,
    ConversationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
