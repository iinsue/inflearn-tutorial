import type { Request } from 'express';
import { LevelType, Prisma } from '@prisma/client';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@ApiTags('course')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  create(@Req() req: Request, @Body() createCourseDto: CreateCourseDto) {
    // user 나 sub가 없다면 401 에러 반환
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }
    return this.coursesService.create(req.user.sub, createCourseDto);
  }

  @Get()
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'categoryIds', required: false })
  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  findAll(
    @Query('title') title?: string,
    @Query('level') level?: LevelType,
    @Query('categoryIds') categoryIds?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const where: Prisma.CourseWhereInput = {};

    if (title) {
      // insensitive 는 대소문자 구분없이 가져오는 것을 의미
      where.title = { contains: title, mode: 'insensitive' };
    }

    if (level) {
      where.level = level;
    }

    if (categoryIds) {
      where.categories = {
        some: {
          id: categoryIds,
        },
      };
    }

    return this.coursesService.findAll({
      where,
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  @Get(':id')
  @ApiQuery({
    name: 'include',
    required: false,
    description: 'section, lecture, courseReviews 등 포함할 관계 지정',
  })
  findOne(
    // ParseUUIDPipe는 Nest에서 제공하는 함수로 UUID인지 검증하고 UUID로 가져오는 함수입니다.
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string,
  ) {
    const includeArray = include ? include.split(',') : undefined;

    return this.coursesService.findOne(id, includeArray);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.coursesService.update(id, req.user.sub, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.coursesService.delete(id, req.user.sub);
  }
}
