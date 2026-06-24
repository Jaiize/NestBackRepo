import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CookieStrategy extends PassportStrategy(Strategy, 'My_Cookie') {
  constructor(private userServ: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies.refresh_token as string,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.REF_SECRET_KEY as string,
      ignoreExpiration: false,
    });
  }

  async validate(...args: object[]) {
    const login = args[0]['user'] as string;

    const userInfo = await this.userServ.findOneInternally(login);
    const user = new User();

    user.email = userInfo.email;
    user.username = userInfo.username;
    user.id = userInfo.id;
    return user;
  }
}
