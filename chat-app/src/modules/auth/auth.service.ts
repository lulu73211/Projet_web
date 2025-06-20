import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginInput, RegisterInput, AuthResponse } from './dto/auth.types';
import { User } from './entities/user.entity';
import { ROLES } from './constants/auth.constants';

// TODO REWORK THIS PART WITH THE ACTUAL PRISMA MODEL
const users: User[] = [];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = users.find((u) => u.email === email);

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
    const existingUser = users.find((u) => u.email === registerInput.email);

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(registerInput.password, 10);

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: Date.now().toString(), // Pour un ID simple en mémoire
      email: registerInput.email,
      username: registerInput.username,
      password: hashedPassword,
      fullName: registerInput.fullName,
      isActive: true,
      roles: ['user'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajouter l'utilisateur à notre "base de données"
    users.push(newUser);

    return this.generateAuthResponse(newUser);
  }

  private generateAuthResponse(user: User): AuthResponse {
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        ...user,
        password: 'undefined', // Ne pas renvoyer le mot de passe
      },
    };
  }

  // Cette méthode sera utilisée par la stratégie JWT
  async getUserById(id: string): Promise<User | undefined> {
    return users.find((user) => user.id === id);
  }

  // Méthode pour récupérer tous les utilisateurs (pour les admins)
  async findAllUsers(): Promise<User[]> {
    return users.map((user) => ({
      ...user,
      password: 'undefined', // Ne pas renvoyer le mot de passe
    }));
  }

  // Méthode pour mettre à jour le rôle d'un utilisateur
  async updateUserRole(userId: string, role: string): Promise<User> {
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Vérifier si le rôle est valide
    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
      throw new UnauthorizedException(`Invalid role: ${role}`);
    }

    // Mettre à jour le rôle
    if (!users[userIndex].roles.includes(role)) {
      users[userIndex].roles.push(role);
    }

    users[userIndex].updatedAt = new Date();

    return {
      ...users[userIndex],
      password: 'undefined', // Ne pas renvoyer le mot de passe
    };
  }

  // Méthode pour supprimer un rôle d'un utilisateur
  async removeUserRole(userId: string, role: string): Promise<User> {
    const userIndex = users.findIndex((user) => user.id === userId);

    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Mettre à jour les rôles
    users[userIndex].roles = users[userIndex].roles.filter((r) => r !== role);
    users[userIndex].updatedAt = new Date();

    return {
      ...users[userIndex],
      password: 'undefined', // Ne pas renvoyer le mot de passe
    };
  }
}
