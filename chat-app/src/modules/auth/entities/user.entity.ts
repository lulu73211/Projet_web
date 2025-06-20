import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  username: string;

  // Ne pas exposer le mot de passe via GraphQL
  password: string;

  @Field({ nullable: true })
  fullName?: string;

  @Field({ defaultValue: false })
  isActive: boolean;

  @Field(() => [String], { defaultValue: [] })
  roles: string[];

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
