/*
import { Reflector } from '@nestjs/core';
import {
  Injectable,
  ExecutionContext,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from 'src/token/token.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
*/

/**
 * JWT manual extraction and authentication without passport
 * NB: No longer active
 */

/*
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenServ: TokenService,
    private readonly configServ: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | boolean | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.tokenServ.verifyToken(token);
      // console.log(payload, token)
      if (payload !== null) {
        request['user'] = payload;
      }
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string {
    const token = request.header('Authorization')?.valueOf();
    const filtered = token?.replace('Bearer ', '')
    // const [type, token] = request.headers.authorization?.split(' ') ?? [];
    // return type === 'Bearer' ? token : undefined;
    return filtered!;
  }
}
*/