import { ObjectType, Field, Int } from '@nestjs/graphql';
import { MessageEntity } from 'src/modules/message/entities/message.model';
import { UserModel } from 'src/modules/user/user.model';

@ObjectType()
export class ConversationModel {
  @Field(() => Int)
  id: number;

  @Field(() => [UserModel])
  users: UserModel[];

  @Field(() => [MessageEntity], { nullable: true })
  messages?: MessageEntity[];
}
