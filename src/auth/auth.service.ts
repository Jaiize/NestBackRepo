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
  constructor(
    private readonly userServ: UserService,
    private readonly tokenServ: TokenService,
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
