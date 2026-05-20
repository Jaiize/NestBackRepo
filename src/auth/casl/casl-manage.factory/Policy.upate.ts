import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Action, Article } from 'src/auth/Action';
import { PolicyHandler } from 'src/auth/Policy.handler';
import { User } from 'src/user/entities/user.entity';
import { AppAbility } from './casl-manage.factory';

@Injectable()
export class PolicyUpdate implements PolicyHandler {
  handler(ability: AppAbility, ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as User;
    // Article id must be retrieved from frontend in order to fetch the article from the backend 
    const art = new Article();
    // Thus, this is just for testing purposes only, not to be utilized this way (making art.authorId = user.id;)
    art.authorId = user.id;
    return ability.can(Action.Update, art);
  }
}

