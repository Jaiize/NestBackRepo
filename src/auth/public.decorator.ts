import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

interface PublicUser {
  email: string;
  username: string;
  id: string;
  isAdmin: string;
  canPost: string;
}

export const publicDoor = 'isPublic';

export const Public = () => SetMetadata(publicDoor, true);

export const UserIntel = createParamDecorator(
  async (data: keyof PublicUser | undefined, context: ExecutionContext) => {
    const gqlctx = GqlExecutionContext.create(context);
    const ctxType = context.getType<GqlContextType>();
    const request =
      ctxType === 'graphql'
        ? gqlctx.getContext<{ req: Request }>().req
        : context.switchToHttp().getRequest<Request>();

    const user = (await request.user) as PublicUser;
    return data ? (user[data] ?? Reflect.get(user, data)) : user;
  },
);
