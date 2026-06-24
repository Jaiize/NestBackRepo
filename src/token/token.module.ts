import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follower } from 'src/user/entities/follower.entity';
// import { CookieStrategy } from './Cookie.Strategy';
// import { CookieGuard } from './Cookie.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Follower]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
  ],
  providers: [TokenService, UserService],
  controllers: [TokenController],
})
export class TokenModule {}
