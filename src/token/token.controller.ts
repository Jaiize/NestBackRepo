import {
  BadRequestException,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';
import { Public } from 'src/auth/public.decorator';
import { CookieGuard } from './Cookie.guard';
import { DataSource } from 'typeorm';
import { CustomConfiguration } from 'src/custom.Config.Service';

@Controller('api/refresh')
export class TokenController {
  private salt = process.env.SALT;
  constructor(
    private readonly tokenServ: TokenService,
    private readonly userServ: UserService,
    private config: CustomConfiguration,
    private data: DataSource,
  ) {}

  @Public()
  @UseGuards(CookieGuard)
  @Post('token')
  async toRefresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response, // passthrough for when res.json() or res.send() is not used, even return would be ignored
  ) {
    const refreshToken = req.cookies.refresh_token as string;

    if (!refreshToken) throw new UnauthorizedException();

    const { email } = req.user as {
      userId: string;
      email: string;
      username: string;
    };

    const user = await this.userServ.findOneInternally(email);

    const isValid: boolean = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isValid) throw new BadRequestException('Expired token!');

    const access_token = this.tokenServ.generateCookieToken(user.email);
    const refresh_token = this.tokenServ.generateRefreshToken(user.email);

    const hash_token: string = await bcrypt.hash(
      refresh_token,
      this.config.salt!,
    );

    user.refreshToken = hash_token;

    await this.data.transaction(async (manager) => {
      await manager.save(user);
    });

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
      // expires: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 7), // A 7day expiration
      path: '/api/refresh/token',
    });
    return { success: true };
  }
}
