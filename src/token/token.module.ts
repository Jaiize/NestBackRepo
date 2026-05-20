import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      global: true,
      useFactory: () => ({
        secret: process.env.SECRET_KEY,
      }),
    }),
  ],
  providers: [TokenService],
  controllers: [TokenController],
})
export class TokenModule {}
