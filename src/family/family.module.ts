import { Module } from '@nestjs/common';
import { FamilyService } from './family.service';
import { FamilyController } from './family.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { User } from 'src/user/entities/user.entity';
import { Follower } from 'src/user/entities/follower.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Family, User, Follower])],
  controllers: [FamilyController],
  providers: [FamilyService, TokenService, UserService],
})
export class FamilyModule {}
