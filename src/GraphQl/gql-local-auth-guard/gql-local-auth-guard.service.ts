import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { GraphQLResolveInfo } from 'graphql';

@Injectable()
export class GqlLocalAuthGuardService extends AuthGuard('My_Gql') {
  getRequest(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const { req } = gqlCtx.getContext<{ req: Request }>();
    const { variableValues } = gqlCtx.getInfo<GraphQLResolveInfo>();
    // const { login, password } = gqlCtx.getArgs<{
    //   login: string;
    //   password: string;
    // }>();

    // req.body = { login, password };
    req.body = variableValues;
    return req;
  }
}
