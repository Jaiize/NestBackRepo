import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Action } from 'src/auth/Action';
import { PolicyHandler } from 'src/auth/Policy.handler';
import { User } from 'src/user/entities/user.entity';
import { AppAbility } from './casl-manage.factory';

@Injectable()
export class PolicyCreate implements PolicyHandler {
  handler(ability: AppAbility, ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as User;
    return ability.can(Action.Create, user);
  }
}
