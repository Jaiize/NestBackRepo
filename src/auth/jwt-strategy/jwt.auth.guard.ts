import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { publicDoor } from '../public.decorator';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('My_jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userServ: UserService,
    private tokenServ: TokenService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(publicDoor, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    if (context.getType<GqlContextType>() === 'graphql') {
      const payload = this.tradeTokenForPayload(context) as {
        user: string;
        iat: number;
        iss: string;
      };
      const user = this.getUserForGql(payload.user);
      const gqlCtx = GqlExecutionContext.create(context);
      const gqlreq = gqlCtx.getContext().req;
      if (gqlreq && payload) {
        gqlreq['user'] = user;
        return gqlreq;
      }
    }

    return super.canActivate(context);
  }

  private tradeTokenForPayload(ctx: ExecutionContext) {
    const request = GqlExecutionContext.create(ctx).getContext<{
      req: Request;
    }>().req;
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return this.tokenServ.verifyTokenForAuth(type === 'Bearer' ? token : '');
  }

  private async getUserForGql(login: string) {
    const userInfo = await this.userServ.findOneInternally(login);
    const user = new User();
    if (userInfo) {
      user.email = userInfo.email;
      user.username = userInfo.username;
      user.id = userInfo.id;
      user.isAdmin = userInfo.isAdmin;
      user.canPost = userInfo.canPost;
      return user;
    }
  }
}
