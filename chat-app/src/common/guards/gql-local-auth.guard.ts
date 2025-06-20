import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlLocalAuthGuard extends AuthGuard('local') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;
    const { email, password } = ctx.getArgs().loginInput;

    // Mute le request pour passport-local
    if (email && password) {
      gqlReq.body = { email, password };
    }

    return gqlReq;
  }
}
