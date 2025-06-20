import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginInput, RegisterInput, AuthResponse } from './dto/auth.types';
import { User, Role } from '@prisma/client';

import { jwtConstants } from './constants/auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const user = await this.validateUser(loginInput.email, loginInput.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async register(registerInput: RegisterInput): Promise<AuthResponse> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: registerInput.email },
          { username: registerInput.username },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    // Créer un nouvel utilisateur
    const newUser = await this.prisma.user.create({
      data: {
        email: registerInput.email,
        username: registerInput.username,
        password: hashedPassword,
        fullName: registerInput.fullName,
        roles: [Role.USER],
      },
    });

    return this.generateAuthResponse(newUser);
  }

  private generateAuthResponse(user: User): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: jwtConstants.secret,
        expiresIn: jwtConstants.expiresIn,
      }),
      user: {
        ...user,
      },
    };
  }

  // Cette méthode sera utilisée par la stratégie JWT
  async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  // Méthodes pour la gestion des rôles
  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async updateUserRole(userId: number, role: Role): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Ajouter le rôle s'il n'existe pas déjà
    if (!user.roles.includes(role)) {
      return this.prisma.user.update({
        where: { id: userId },
        data: {
          roles: [...user.roles, role],
        },
      });
    }

    return user;
  }

  async removeUserRole(userId: number, role: Role): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: user.roles.filter((r) => r !== role),
      },
    });
  }
}
