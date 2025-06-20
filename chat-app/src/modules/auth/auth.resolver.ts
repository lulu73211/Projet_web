import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { LoginInput, RegisterInput, AuthResponse } from './dto/auth.types';

import { ROLES } from './constants/auth.constants';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';

@Resolver(() => User)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(
    @Args('registerInput') registerInput: RegisterInput,
  ): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    // Le user est automatiquement extrait du token JWT et injecté
    // grâce au décorateur @CurrentUser()
    return user;
  }

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN)
  async getAllUsers(): Promise<User[]> {
    // Cette route ne sera accessible que pour les utilisateurs
    // ayant le rôle ADMIN
    return this.authService.findAllUsers();
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.ADMIN, ROLES.MODERATOR)
  async updateUserRole(
    @Args('userId') userId: string,
    @Args('role') role: string,
  ): Promise<User> {
    // Cette route ne sera accessible que pour les utilisateurs
    // ayant le rôle ADMIN ou MODERATOR
    return this.authService.updateUserRole(userId, role);
  }
}
