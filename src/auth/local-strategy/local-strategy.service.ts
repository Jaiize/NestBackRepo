import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class LocalStrategyService extends PassportStrategy(
  Strategy,
  'My_local',
) {
  constructor(
    private authServ: AuthService,
    private moduleRef: ModuleRef,
  ) {
    /**
     * passReqToCallback property is for request-scoped providers which must be true
     */
    super({
      usernameField: 'login',
      passwordField: 'password',
      // passReqToCallback: false,
    });
  }
  // async validate(login: string, password: string, request: Request) {
  async validate(login: string, password: string) {
    const user = await this.authServ.validateUser(login, password);

    /**
     * contextid and moduleRef is for resolving request-scoped providers
     */
    // const contextId = ContextIdFactory.getByRequest(request);
    // const authService = this.moduleRef.resolve(AuthService, contextId)
    return user;
  }
}
