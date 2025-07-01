import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConversationService } from './conversation.service';
import { ConversationModel } from './entities/conversation.model';

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

  @Mutation(() => ConversationModel)
  createConversation(
    @Args({ name: 'userIds', type: () => [Int] }) userIds: number[],
  ) {
    return this.service.create(userIds);
  }
}
