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

@Injectable()
export class AuthService {
  private tokenBlacklisted = new Set<string>();

  constructor(
    private readonly userServ: UserService,
    private readonly tokenServ: TokenService,
  ) {}
  private salt = process.env.SALT;

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
        // throw new BadRequestException('Incorrect user input', 'Incorrect Password!');
      } else {
        return user;
      }
    }
  }

  async login(user: SignIn) {
    const token = this.tokenServ.generateToken(user);
    const { username } = await this.userServ.findOneInternally(user.login);
    return { key: token, name: username };
  }

  logout(token: string) {
    const payload = this.tokenServ.verifyTokenForTest(token);
    this.blacklistToken(token.split(' ')[1]);
    const expiredLog = this.tokenServ.signOut(payload as object);
    return expiredLog;
  }

  async register(user: User) {
    const backUser = await this.userServ.findOneByEmail(user);
    if (backUser) {
      const hash_password = await bcrypt.hash(user.password, this.salt!);
      const new_user: User = { ...user, password: hash_password };
      const new_user_stored = await this.userServ.create(new_user);
      const token = this.tokenServ.generateToken({
        login: new_user_stored.email,
        password: '',
      });
      return token;
    }
  }

  verifyBlacklistedToken(token: string) {
    if (this.tokenBlacklisted.has(token)) {
      return false;
    } else {
      return true;
    }
  }

  private blacklistToken(token: string) {
    this.tokenBlacklisted.add(token);
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
