import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TokenService } from 'src/token/token.service';
import { UserService } from 'src/user/user.service';
import { CustomConfiguration } from 'src/custom-config/custom.Config.Service';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    TokenService,
    UserService,
    CustomConfiguration,
  ],
})
export class ChatModule {}
