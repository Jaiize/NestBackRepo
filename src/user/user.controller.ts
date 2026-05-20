import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Follow, UserService } from './user.service';
import { User } from './entities/user.entity';
import { PoliciesGuard } from 'src/auth/Policies.Guard';
import { CheckPolicies } from 'src/auth/Policy.check';
import { PolicyManage } from 'src/auth/casl/casl-manage.factory/Policy.manage';
import { ChangePass } from 'src/login.details';
import { Public } from 'src/auth/public.decorator';
import { Follower } from './entities/follower.entity';
import { Response } from 'express';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  toCreate(@Body() createUserDto: User) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyManage())
  @Get()
  toFindAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  toFindOne(@Param('id') login: string) {
    return this.userService.findOneBy(login);
  }

  @Public()
  @Get('query/:id')
  toFindOneForOutput(@Param('id') login: string) {
    return this.userService.findOneByQuery(login);
  }

  @Post('follow')
  async toFollowUser(@Body() follow: Follow): Promise<Follower> {
    return await this.userService.followUser(follow);
  }

  @Post('unfollow')
  async toUnfollowUser(@Body() follow: Follow, @Res() res: Response) {
    const result = await this.userService.unFollowUser(follow);
    return res.json(result);
  }

  @Get('pull/followers/:id')
  async toGetFollowers(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getFollowers(userId);
  }

  @Get('pull/following/:id')
  async toGetFollowing(@Param('id') userId: string): Promise<User[]> {
    return this.userService.getFollowing(userId);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyManage())
  @Patch()
  toUpdate(@Body() find: User) {
    return this.userService.update(find);
  }

  /**
   * Remember that this route is not protected by any guard, and needs strict client-filtering
   * services or checkings before accessing.
   * @param change : object type of {email: string, password: string}
   * @returns : a string meassage "Successfully changed"
   */
  @Public()
  @Patch('auth/password/alt')
  toUpdatePass(@Body() change: ChangePass) {
    return this.userService.updatePass(change);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies(new PolicyManage())
  @Delete()
  toRemove(@Body() email: string) {
    return this.userService.remove(email);
  }
}
