import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  AppAbility,
  CaslManageFactory,
} from './casl/casl-manage.factory/casl-manage.factory';
import { PolicyHandler } from './Policy.handler';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';
import { policyDoor } from './Policy.check';
// import { Action } from './Action';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbility: CaslManageFactory,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const policyHandlers = this.reflector.getAllAndOverride<PolicyHandler[]>(
      policyDoor,
      [context.getHandler(), context.getClass()],
    );

    if (!policyHandlers) {
      // Does not seem important since it's not the default guard, Worth checking and testing!!!
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request>();
    const strained_user = user as User;
    const ability = this.caslAbility.createForUser(strained_user);
    // ability.relevantRuleFor(Action.Create, user!)
    // console.log(ability.rules)
    // console.log(user, user?.constructor.name)

    return policyHandlers.every((handler) =>
      this.execPolicyHandler(handler, ability as AppAbility, context),
    );
  }

  private execPolicyHandler(
    handler: PolicyHandler,
    ability: AppAbility,
    ctx: ExecutionContext,
  ) {
    // if (typeof handler === 'function') {
    //   return handler(ability, ctx);
    // }
    return handler.handler(ability, ctx);
  }
}

// Work on policy and more on authorization
