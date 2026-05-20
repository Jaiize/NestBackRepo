import { Controller, Headers, Post, Res } from '@nestjs/common';
import { TokenService } from './token.service';
import { Response } from 'express';

@Controller('api/token')
export class TokenController {
  constructor(private readonly tokenServ: TokenService) {}
  @Post('factor')
  toRefresh(@Headers('Authorization') token: string, @Res() res: Response) {
    const ver_token = this.tokenServ.generateRefreshToken(token);
    res.header('Authorization', ver_token)
    res.json('Verified!');
  }
}
