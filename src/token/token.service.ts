import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignIn } from 'src/login.details';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwtServ: JwtService) {}

  generateToken(user: SignIn) {
    const payload = { user: user.login };
    return this.jwtServ.sign(payload, {
      issuer: 'Tosin Emmanuel',
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
        // Check
        const { user } = payload as { user: string; iat: number; iss: string };
        return user;
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  verifyTokenForTest(token: string) {
    try {
      const tokenTaken = token.split(' ')[1];
      const payload = this.jwtServ.verify<object>(tokenTaken);
      if (payload !== null) {
        return payload;
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  signOut(payload: object): string {
    //  Just for testing purposes, logout mechanism can be handled at client side!
    // 60, "2 days", "10h", "7d"
    return this.jwtServ.sign(payload, { expiresIn: 0 });
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
