import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { SignIn } from 'src/login.details';
import { Response } from 'express';
import { LocalAuthGuard } from './local-strategy/local.auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private authServ: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async toLogin(@Body() user: SignIn, @Res() res: Response) {
    const { key, name } = await this.authServ.login(user);
    res.header('Authorization', `Bearer ${key}`);
    return res.json(`Welcome ${name}`);
  }

  @Public()
  @Post('register')
  async toRegister(@Body() register: User, @Res() res: Response) {
    const token = await this.authServ.register(register);
    res.header('Authorization', `Bearer ${token}`);
    return res.json('Account Registered Successfully!');
  }

  // Just for testing purposes only!
  @Post('logout')
  toLogout(@Res() res: Response, @Headers('Authorization') head: string) {
    this.authServ.logout(head);
    // console.log(req['user'])
    // console.log(req.user)
    return res.json('logged out successfuly!');
  }
}

// node --trace-deprecation ...
