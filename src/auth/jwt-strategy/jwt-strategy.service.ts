import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { CustomConfiguration } from 'src/custom.Config.Service';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategyService extends PassportStrategy(Strategy, 'My_jwt') {
  constructor(
    private userServ: UserService,
    private configServ: CustomConfiguration,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies.access_token as string
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configServ.secretKey!,
    });
  }

  async validate(...args: object[]) {
    const login = args[0]['user'] as string;

    const userInfo = await this.userServ.findOneInternally(login);
    const user = new User()

    if (userInfo) {
      user.email = userInfo.email
      user.username = userInfo.username
      user.id = userInfo.id
      user.isAdmin = userInfo.isAdmin
      user.canPost = userInfo.canPost 
      // console.log(args[0], '\n', user);
      return user;
      // console.log(this.configService.allEnv)
    } 
  }
}
