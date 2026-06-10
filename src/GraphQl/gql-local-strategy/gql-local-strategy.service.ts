import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class GqlLocalStrategyService extends PassportStrategy(
  Strategy,
  'My_Gql',
) {
  constructor(private authServ: AuthService) {
    super({
      usernameField: 'login',
      passwordField: 'password',
    });
  }

  async validate(login: string, password: string) {
    const user = await this.authServ.validateUser(login, password);
    return user;
  }
}
