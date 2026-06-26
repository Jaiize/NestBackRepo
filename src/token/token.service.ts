import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignIn } from 'src/login.details';
import { JwtService } from '@nestjs/jwt';
import { CustomConfiguration } from 'src/custom.Config.Service';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtServ: JwtService,
    private configServ: CustomConfiguration,
  ) {}

  generateToken(user: SignIn) {
    const payload = { user: user.login };
    return this.jwtServ.sign(payload, {
      algorithm: 'HS384',
    });
  }

  generateCookieToken(email: string) {
    const payload = { user: email };
    return this.jwtServ.sign(payload, {
      algorithm: 'HS384',
      expiresIn: '1 Hr',
    });
  }

  generateRefreshToken(email: string) {
    const payload = { user: email };
    return this.jwtServ.sign(payload, {
      algorithm: 'HS512',
      secret: this.configServ.refSecretKey,
      expiresIn: '7 Days',
    });
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
