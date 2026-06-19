import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

export const publicDoor = 'isPublic';

export const Public = () => SetMetadata(publicDoor, true);

export const UserIntel = createParamDecorator(
  async (data: keyof User | undefined, context: ExecutionContext) => {
    const gqlctx = GqlExecutionContext.create(context);
    const ctxType = context.getType<GqlContextType>();
    const request =
      ctxType === 'graphql'
        ? gqlctx.getContext<{ req: Request }>().req
        : context.switchToHttp().getRequest<Request>();

    const user = (await request.user) as User;
    return data ? (user[data] ?? Reflect.get(user, data)) : user;
  },
);
