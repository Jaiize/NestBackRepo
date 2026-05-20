import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TokenService } from 'src/token/token.service';
import { CaslManageFactory } from 'src/auth/casl/casl-manage.factory/casl-manage.factory';
import { Follower } from './entities/follower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follower])],
  controllers: [UserController],
  providers: [UserService, TokenService, CaslManageFactory],
})
export class UserModule {}
