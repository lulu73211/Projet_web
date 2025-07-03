import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { ConversationModel } from './entities/conversation.model';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { JwtPayload } from '../auth/dto/auth.types';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/common/guards/gql-local-auth.guard';

@Resolver(() => ConversationModel)
export class ConversationResolver {
  constructor(private service: ConversationService) {}

  @Query(() => [ConversationModel])
  conversations() {
    return this.service.getAll();
  }

  @Query(() => ConversationModel, { nullable: true })
  conversation(@Args('id', { type: () => Int }) id: number) {
    return this.service.getById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ConversationModel])
  myConversations(@CurrentUser() user: JwtPayload) {
    return this.service.getByUserId(user.sub);
  }

  @Mutation(() => ConversationModel)
  createConversation(
    @Args({ name: 'userIds', type: () => [Int] }) userIds: number[],
  ) {
    return this.service.create(userIds);
  }
}
