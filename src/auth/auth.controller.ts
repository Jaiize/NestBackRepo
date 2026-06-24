import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { AuthService } from './auth.service';
import { SignIn } from 'src/login.details';
import { Response } from 'express';
import { LocalAuthGuard } from './local-strategy/local.auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authServ: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  toLogin(@Body() user: SignIn, @Res() res: Response) {
    const { token, info } = this.authServ.login(user);
    res.header('Authorization', `Bearer ${token}`);
    return res.json(`Welcome ${info}`);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('cookielogin')
  async cookieLogin(@Body() user: SignIn, @Res() res: Response) {
    const { access_token, refresh_token } =
      await this.authServ.cookieLogin(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1e3 * 60 * 60,
    });

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1e3 * 60 * 60 * 24 * 7,
      path: '/api/refresh/token',
    });
    res.json({ success: true });
  }
}

// node --trace-deprecation ...
