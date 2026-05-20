/*
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';

*/

/**
 * No longer active because CASL has taken over
 */

/*
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
    private userServ: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const forPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (forPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFrmHeader(request);

    const payload = this.tokenService.verifyToken(token!);
    const userInfo = payload!['user'] as string;
    const user = await this.userServ.findOne(userInfo);

    // Only authenticated admins can access the endpoint(s) guarded by this!
    if (userInfo !== undefined && user !== null && user.isAdmin == true){
      return true;
    }
    throw new BadRequestException("You don't have access to this route!");
  }

  private extractTokenFrmHeader(request: Request) {
    // Bearer stll Not filtered
    const token = request.header('Authorization')?.valueOf();
    return token;
  }
}

*/