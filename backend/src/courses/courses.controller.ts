import type { Request } from 'express';
import { LevelType, Prisma } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';
import { Course as CourseEntity } from 'src/_gen/prisma-class/course';
import { CourseFavorite as CourseFavoriteEntity } from 'src/_gen/prisma-class/course_favorite';

import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SearchCourseDto } from './dto/search-course.dto';
import { CourseDetailDto } from './dto/course-detail.dto';
import { GetFavoriteResponseDto } from './dto/favorite.dto';
import { SearchCourseResponseDto } from './dto/search-response.dto';

@ApiTags('코스')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 생성',
    type: CourseEntity,
  })
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
  @ApiOkResponse({
    description: '코스 목록',
    type: CourseEntity,
    isArray: true,
  })
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
  @ApiOkResponse({
    description: '코스 상세 정보',
    type: CourseDetailDto,
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    description: '코스 수정',
    type: CourseEntity,
  })
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
  @ApiOkResponse({
    description: '코스 삭제',
    type: CourseEntity,
  })
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.coursesService.delete(id, req.user.sub);
  }

  @Post('search')
  @ApiOkResponse({
    description: '코스 검색',
    type: SearchCourseResponseDto,
  })
  search(@Body() searchCourseDto: SearchCourseDto) {
    return this.coursesService.searchCourses(searchCourseDto);
  }

  // 즐겨찾기 등록
  @Post(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiResponse({ type: Boolean })
  addFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    // user 나 sub가 없다면 401 에러 반환
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.coursesService.addFavorite(id, req.user.sub);
  }

  // 즐겨찾기 삭제
  @Delete(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: Boolean })
  removeFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    // user 나 sub가 없다면 401 에러 반환
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.coursesService.removeFavorite(id, req.user.sub);
  }

  // 개별 강의 즐겨찾기 조회
  @Get(':id/favorite')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: GetFavoriteResponseDto })
  getFavorite(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    // user 나 sub가 없다면 401 에러 반환
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.coursesService.getFavorite(id, req.user.sub);
  }

  // 나의 모든 즐겨찾기 조회
  @Get('favorite/my')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({ type: CourseFavoriteEntity })
  getMyFavorites(@Req() req: Request) {
    // user 나 sub가 없다면 401 에러 반환
    if (!req.user?.sub) {
      throw new UnauthorizedException(
        '유효하지 않은 인증 토큰이거나 사용자 정보가 없습니다.',
      );
    }

    return this.coursesService.getMyFavorites(req.user.sub);
  }
}
