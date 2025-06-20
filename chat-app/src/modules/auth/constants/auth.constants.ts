export const jwtConstants = {
  secret: 'your-secret-key', // Utiliser une variable d'environnement en production
  expiresIn: '1d',
};

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};
