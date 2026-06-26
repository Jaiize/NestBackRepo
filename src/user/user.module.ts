import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TokenService } from 'src/token/token.service';
import { CaslManageFactory } from 'src/auth/casl/casl-manage.factory/casl-manage.factory';
import { JwtStrategyService } from 'src/auth/jwt-strategy/jwt-strategy.service';
import { CustomConfiguration } from 'src/custom.Config.Service';
import { CookieStrategy } from 'src/token/Cookie.strategy';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    TokenService,
    CaslManageFactory,
    JwtStrategyService,
    CookieStrategy,
    CustomConfiguration,
  ],
})
export class UserModule {}
