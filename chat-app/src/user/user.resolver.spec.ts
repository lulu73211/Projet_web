import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from './user.model';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [UserModel], { name: 'users' })
  async users() {
    return this.userService.users();
  }

  @Query(() => UserModel, { name: 'user', nullable: true })
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.userService.user(id);
  }

  @Mutation(() => UserModel)
  async createUser(
    @Args('name') name: string,
    @Args('email') email: string,
  ) {
    return this.userService.createUser({ name, email });
  }
}
