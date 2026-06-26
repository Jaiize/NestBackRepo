import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { SignIn } from 'src/login.details';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { CustomConfiguration } from 'src/custom.Config.Service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userServ: UserService,
    private readonly tokenServ: TokenService,
    private configServ: CustomConfiguration,
    private data: DataSource,
  ) {}


  async validateUser(login: string, password: string): Promise<User> {
    const user = await this.userServ.findOneInternally(login);

    if (!user) {
      throw new NotFoundException('User not found!');
    } else {
      const isValidPassword: boolean = await bcrypt.compare(
        password,
        user.password,
      );
      if (!isValidPassword) {
        throw new BadRequestException('Incorrect Password!');
      } else {
        return user;
      }
    }
  }

  login(user: SignIn) {
    const token = this.tokenServ.generateToken(user);
    return { token, info: user.login };
  }

  async cookieLogin(user: SignIn) {
    const access_token = this.tokenServ.generateCookieToken(user.login);
    const refresh_token = this.tokenServ.generateRefreshToken(user.login);
    const hashToken: string = await bcrypt.hash(
      refresh_token,
      this.configServ.salt!,
    );
    const fetched_user = await this.userServ.findOneInternally(user.login);
    fetched_user.refreshToken = hashToken;

    await this.data.transaction(async (manager) => {
      await manager.save(fetched_user);
    });

    return { access_token, refresh_token };
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
