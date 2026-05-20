import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { WebSocketGate } from 'src/WebSocketGate';
import { TokenService } from 'src/token/token.service';
import { CaslManageFactory } from 'src/auth/casl/casl-manage.factory/casl-manage.factory';
import { PolicyUpdate } from 'src/auth/casl/casl-manage.factory/Policy.upate';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  controllers: [RoomsController],
  providers: [
    PolicyUpdate,
    RoomsService,
    WebSocketGate,
    TokenService,
    CaslManageFactory,
  ],
})
export class RoomsModule {}
