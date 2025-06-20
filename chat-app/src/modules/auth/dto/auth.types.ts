import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  fullName?: string;
}

@ObjectType()
export class JwtPayload {
  @Field()
  sub: string;

  @Field()
  email: string;

  @Field(() => [String])
  roles: string[];
}
