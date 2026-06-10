import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { AuthService } from './auth.service';
import { SignIn } from 'src/login.details';
import { Response } from 'express';
import { LocalAuthGuard } from './local-strategy/local.auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authServ: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  toLogin(@Body() user: SignIn, @Res() res: Response) {
    const { token, info } = this.authServ.login(user);
    res.header('Authorization', `Bearer ${token}`);
    return res.json(`Welcome ${info}`);
  }
}

// node --trace-deprecation ...
