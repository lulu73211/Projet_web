import { Resolver, Mutation, Args, Query, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput, AuthResponse } from './dto/auth.types';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

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
  @Roles(Role.ADMIN)
  async getAllUsers(): Promise<User[]> {
    // Cette route ne sera accessible que pour les utilisateurs
    // ayant le rôle ADMIN
    return this.authService.findAllUsers();
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.MODERATOR)
  async updateUserRole(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('role', { type: () => String }) role: Role,
  ): Promise<User> {
    // Cette route ne sera accessible que pour les utilisateurs
    // ayant le rôle ADMIN ou MODERATOR
    return this.authService.updateUserRole(userId, role);
  }
}
