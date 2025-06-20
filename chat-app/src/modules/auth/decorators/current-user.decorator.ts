import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

/**
 * Décorateur pour récupérer l'utilisateur courant du contexte
 * Peut être utilisé dans les resolvers GraphQL et les contrôleurs REST
 *
 * Exemple d'utilisation:
 * ```typescript
 * @Query(returns => User)
 * async me(@CurrentUser() user: User) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    // Pour GraphQL, nous devons convertir le contexte
    const ctx = GqlExecutionContext.create(context);
    // L'utilisateur est stocké dans req.user par Passport
    const user = ctx.getContext().req.user;

    // Si data est spécifié, retourne seulement cette propriété de l'utilisateur
    if (data) {
      return user?.[data as keyof typeof user];
    }

    return user;
  },
);
