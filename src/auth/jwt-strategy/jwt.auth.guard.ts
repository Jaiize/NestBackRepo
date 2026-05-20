import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  // UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { publicDoor } from '../public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('My_jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authServ: AuthService,
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

    const req = context.switchToHttp().getRequest<Request>();

    if (isPublic) {
      return true;
    } else if (!this.authServ.verifyBlacklistedToken(this.extractToken(req))) {
      throw new BadRequestException('Blacklisted token, please log in!');
    }
    // Just in case you want to overide 401 error status!
    // throw new UnauthorizedException('Please sign up or log in!')

    return super.canActivate(context);
  }

  private extractToken(request: Request) {
    const strained = request.headers.authorization?.split(' ')[1];
    return strained!;
  }
}
