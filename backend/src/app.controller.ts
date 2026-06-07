import { JWTPayload } from 'jose';
import { type Request } from 'express';
import type { User } from '@prisma/client';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { AccessTokenGuard } from './auth/guards/access-token.guard';

// better-auth의 표준 유저 스키마 정의
export type BetterAuthJWTPayload = User & JWTPayload;
export interface RequestWithUser extends Request {
  user?: BetterAuthJWTPayload;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('user-test')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiUnauthorizedResponse({ description: 'Invalid or missing JWT' })
  testUser(@Req() req: RequestWithUser) {
    return `유저 이메일: ${req.user?.email}`;
  }
}
