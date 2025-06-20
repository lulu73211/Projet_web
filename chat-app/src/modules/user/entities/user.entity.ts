import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { ConversationModel } from 'src/modules/conversation/entities/conversation.model';
import { MessageEntity } from 'src/modules/message/entities/message.model';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  username: string;

  // Ne pas exposer le mot de passe via GraphQL
  password: string;

  @Field(() => String, { nullable: true })
  fullName: string | null;

  @Field()
  isActive: boolean;

  @Field(() => [String])
  roles: Role[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [MessageEntity], { nullable: true })
  messages?: MessageEntity[];

  @Field(() => [ConversationModel], { nullable: true })
  conversations?: ConversationModel[];
}
