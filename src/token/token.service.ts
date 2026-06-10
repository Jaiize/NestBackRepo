import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignIn } from 'src/login.details';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtServ: JwtService) {}

  generateToken(user: SignIn) {
    const payload = { user: user.login };
    return this.jwtServ.sign(payload, {
      issuer: 'Jaize',
      algorithm: 'HS384',
    });
  }

  generateRefreshToken(token: string) {
    const user = this.verifyToken(token);
    const payload = { user: user };
    return this.jwtServ.sign(payload, {
      algorithm: 'HS512',
    });
  }

  verifyToken(token: string) {
    try {
      const tokenTaken = token.split(' ')[1];
      const payload = this.jwtServ.verify<object>(tokenTaken);
      if (payload !== null) {
        const { user } = payload as { user: string; iat: number; iss: string };
        return user;
      }
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

  verifyTokenForAuth(token: string) {
    try {
      const payload = this.jwtServ.verify<object>(token);
      if (payload !== null) {
        return payload;
      }
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }

}

// JwtPayload properties

// [key: string]: any;
// iss?: string | undefined;
// sub?: string | undefined;
// aud?: string | string[] | undefined;
// exp?: number | undefined;
// nbf?: number | undefined;
// iat?: number | undefined;
// jti?: string | undefined;
