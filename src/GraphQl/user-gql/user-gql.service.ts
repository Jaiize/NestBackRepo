import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserObj } from './UserObj';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserService } from 'src/user/user.service';
import { Public, UserIntel } from 'src/auth/public.decorator';
import { UserInput } from './user.input';
import { Response } from 'express';
import { TokenService } from 'src/token/token.service';
import { AuthService } from 'src/auth/auth.service';
import { GqlLocalAuthGuardService } from '../gql-local-auth-guard/gql-local-auth-guard.service';

@Resolver(() => UserObj)
export class UserGqlService {
  constructor(
    private readonly userServ: UserService,
    private readonly authServ: AuthService,
  ) {}

  // Fetch all users
  @Query(() => [UserObj], { name: 'users' })
  async getUsers() {
    const users = await this.userServ.findAll();
    return users.map((u) => plainToInstance(UserObj, u));
  }

  // Get one user by username, email or name
  @Query(() => UserObj, { name: 'user' })
  async getUser(
    @Args('info') info: string,
    @UserIntel('email') inUser: string,
  ) {
    console.log('UserIntel: ', inUser);
    const user = await this.userServ.findOneWithQuery(info);

    if (!user) {
      throw new NotFoundException('user not found!');
    }

    return plainToInstance(UserObj, user, {
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

  //Log in user
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
