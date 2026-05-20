import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Action, Article } from 'src/auth/Action';
import { PolicyHandler } from 'src/auth/Policy.handler';
import { User } from 'src/user/entities/user.entity';
import { AppAbility } from './casl-manage.factory';

@Injectable()
export class PolicyDelete implements PolicyHandler {
  handler(ability: AppAbility, ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    // const user = req.user as User;
    const art = new Article();
    // art.isPublished = false // For real testing!
    art.isPublished = req.body.isPublished as boolean; // Does not exist yet!
    return ability.can(Action.Delete, art);
  }
}
