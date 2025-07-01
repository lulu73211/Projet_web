export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key-dev-only',
  expiresIn: '1d',
};
