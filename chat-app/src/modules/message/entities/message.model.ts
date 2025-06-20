import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ConversationModel } from 'src/modules/conversation/entities/conversation.model';
import { UserModel } from 'src/modules/user/user.model';

@ObjectType()
export class MessageModel {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;

  @Field()
  createdAt: Date;

  @Field(() => UserModel)
  author: UserModel;

  @Field(() => ConversationModel)
  conversation: ConversationModel;
}
