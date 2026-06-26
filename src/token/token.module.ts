import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follower } from 'src/user/entities/follower.entity';
import { CustomConfiguration } from 'src/custom.Config.Service';
import { CustomConfigModule } from 'src/custom-config/custom-config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Follower]),
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfiguration],
      global: true,
      useFactory: (config: CustomConfiguration) => ({
        secret: config.secretKey,
      }),
    }),
  ],
  providers: [TokenService, UserService, CustomConfiguration],
  controllers: [TokenController],
})
export class TokenModule {}
