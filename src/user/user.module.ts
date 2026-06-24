import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TokenService } from 'src/token/token.service';
import { CaslManageFactory } from 'src/auth/casl/casl-manage.factory/casl-manage.factory';
import { Follower } from './entities/follower.entity';
import { JwtStrategyService } from 'src/auth/jwt-strategy/jwt-strategy.service';
import { CustomConfiguration } from 'src/custom.Config.Service';
import { CookieStrategy } from 'src/token/Cookie.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follower])],
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
