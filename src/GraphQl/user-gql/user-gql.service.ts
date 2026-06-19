import {
  Args,
  Context,
  Info,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UserObj } from './UserObj';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { Public } from 'src/auth/public.decorator';
import { UserInput } from './user.input';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { GqlLocalAuthGuardService } from '../gql-local-auth-guard/gql-local-auth-guard.service';
import { WhatToWhatService } from 'src/what-to-what/what-to-what.service';
import { GraphQLResolveInfo } from 'graphql';

@Resolver(() => UserObj)
export class UserGqlService {
  constructor(
    private readonly userServ: UserService,
    private readonly authServ: AuthService,
    private readonly what: WhatToWhatService,
  ) {}

  // Fetch all users
  @Query(() => [UserObj], { name: 'users' })
  async getUsers() {
    const users = await this.userServ.findAll();
    return users.map((u) => this.what.plainToInstance(UserObj, u));
  }

  // Get one user by username, email or name
  @Query(() => UserObj, { name: 'user' })
  async getUser(@Args('info') info: string) {
    const user = await this.userServ.findOneWithQuery(info);

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    return this.what.plainToInstance(UserObj, user, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    });
  }

  // Register new user
  @Mutation(() => UserObj, { name: 'newUser' })
  @Public()
  async createUser(
    @Args('user') user: UserInput,
    @Context() ctx: { res: Response; req: Request },
  ) {
    const tokenAndUser = this.userServ.register(user);
    await tokenAndUser.then((o) => {
      ctx.res.header('Authorization', `Bearer ${o?.token}`);
      ctx.res.json({ accessToken: o?.token, user: o?.user });
    });
  }

  // Log in user
  @UseGuards(GqlLocalAuthGuardService)
  @Public()
  @Mutation(() => UserObj, { name: 'loginUser' })
  toLogUserIn(
    @Args('login') login: string,
    @Args('password') password: string,
    @Context() ctx: { res: Response; req: Request },
  ) {
    const raw = this.authServ.login({ login, password: password });
    ctx.res.header('Authorization', `Bearer ${raw.token}`);
    ctx.res.json({ accessToken: raw.token, name: login, message: 'Logged in' });
  }
}
