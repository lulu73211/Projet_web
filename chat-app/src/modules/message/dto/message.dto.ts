import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsInt, IsString } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  conversationId: number;
}

@ObjectType()
export class MessagePayload {
  @Field()
  @IsNotEmpty()
  @IsString()
  content: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  authorId: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  conversationId: number;
}
