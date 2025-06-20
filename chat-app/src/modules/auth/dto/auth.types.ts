import { Field, ObjectType, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { User } from 'src/modules/user/entities/user.entity';

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
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(3)
  username: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fullName: string | null;
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
