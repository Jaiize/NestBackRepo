import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { UserModule } from 'src/user/user.module';
import { LocalStrategyService } from './local-strategy/local-strategy.service';
import { PassportModule } from '@nestjs/passport';
import { CustomConfiguration } from 'src/custom.Config.Service';
import { UserGqlModule } from 'src/GraphQl/user-gql/user-gql.module';
import { GqlLocalStrategyService } from 'src/GraphQl/gql-local-strategy/gql-local-strategy.service';
// import { Family } from 'src/family/entities/family.entity';

/**
 * passportModule must call the .register({ session: true }) method for utilizing sessions
 */

@Module({
  imports: [UserModule, PassportModule, UserGqlModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    UserService,
    LocalStrategyService,
    GqlLocalStrategyService,
    CustomConfiguration,
  ],
  exports: [AuthService],
})
export class AuthModule {}
