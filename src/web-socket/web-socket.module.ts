import { Module } from '@nestjs/common';
import { CustomConfiguration } from 'src/custom-config/custom.Config.Service';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { WebSocketGate } from 'src/WebSocketGate';

@Module({
  providers: [WebSocketGate, UserService, TokenService, CustomConfiguration],
})
export class WebSocketModule {}
