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
  (data: string | undefined, context: ExecutionContext) => {
    const gqlctx = GqlExecutionContext.create(context);
    const ctxType = context.getType<GqlContextType>();
    const request =
      ctxType === 'graphql'
        ? (gqlctx.getContext().req as Request)
        : context.switchToHttp().getRequest<Request>();

    return data ? request.user![data] : (request.user as User);
  },
);
