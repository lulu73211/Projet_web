export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key-dev-only', // Toujours utiliser une variable d'environnement en production
  expiresIn: '1d',
};

// Note: Les rôles sont maintenant définis dans le schema Prisma comme enum Role
