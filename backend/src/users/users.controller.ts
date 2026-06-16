import type { Request } from 'express';
import { ApiBearerAuth, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { User as UserEntity } from 'src/_gen/prisma-class/user';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({
    description: '프로필 조회',
    type: UserEntity,
  })
  getProfile(@Req() req: Request) {
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '프로필 수정',
    type: UserEntity,
  })
  updateProfile(@Req() req: Request, @Body() updateUserDto: UpdateUserDto) {
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.usersService.updateProfile(req.user.sub, updateUserDto);
  }
}
