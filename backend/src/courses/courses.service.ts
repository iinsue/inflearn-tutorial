import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Course, Prisma } from '@prisma/client';

import slugify from 'lib/slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseFavorite as CourseFavoriteEntity } from 'src/_gen/prisma-class/course_favorite';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { SearchCourseDto } from './dto/search-course.dto';
import { CourseDetailDto } from './dto/course-detail.dto';
import { GetFavoriteResponseDto } from './dto/favorite.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createCourseDto: CreateCourseDto,
  ): Promise<Course> {
    return this.prisma.client.course.create({
      data: {
        title: createCourseDto.title,
        slug: slugify(createCourseDto.title),
        instructorId: userId,
        status: 'DRAFT',
      },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.CourseWhereUniqueInput;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput;
  }): Promise<Course[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.client.course.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(id: string): Promise<CourseDetailDto | null> {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
      include: {
        instructor: true,
        categories: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        enrollments: true,
        sections: {
          include: {
            lectures: {
              select: {
                id: true,
                title: true,
                isPreview: true,
                duration: true,
                order: true,
              },
              orderBy: { order: 'asc' },
            },
          },

          orderBy: { order: 'asc' },
        },

        _count: {
          select: { lectures: true, enrollments: true, reviews: true },
        },
      },
    });

    if (!course) {
      return null;
    }

    const averageRating =
      course.reviews.length > 0
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) /
          course.reviews.length
        : 0;

    const totalDuration = course.sections.reduce((sum, section) => {
      return (
        sum +
        section.lectures.reduce((lecSum, lecture) => {
          return lecSum + (lecture.duration || 0);
        }, 0)
      );
    }, 0);

    const result = {
      ...course,
      totalEnrollments: course._count.enrollments,
      averabeRating: Math.round(averageRating * 10) / 10,
      totalReviews: course._count.reviews,
      totalLectures: course._count.lectures,
      totalDuration,
    };

    return result as unknown as CourseDetailDto;
  }

  async update(
    id: string,
    userId: string,
    updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`ID: ${id} 코스를 찾을 수 없습니다.`);
    }

    const { categoryIds, ...otherData } = updateCourseDto;
    let data: Prisma.CourseUpdateInput = {
      ...otherData,
    };

    if (course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 수정할 수 있습니다.');
    }

    if (categoryIds && categoryIds.length > 0) {
      data.categories = {
        connect: categoryIds.map((id) => ({ id })),
      };
    }

    return this.prisma.client.course.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.client.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw new NotFoundException(`ID: ${id} 코스를 찾을 수 없습니다.`);
    }

    if (course.instructorId !== userId) {
      throw new UnauthorizedException('강의의 소유자만 삭제할 수 있습니다.');
    }

    await this.prisma.client.course.delete({
      where: { id },
    });

    return course;
  }

  // 검색 메서드
  async searchCourses(searchCourseDto: SearchCourseDto) {
    const { q, category, priceRange, sortBy, order, page, pageSize } =
      searchCourseDto;
    const where: Prisma.CourseWhereInput = {};

    // 키워드 검색 (강의명, 강사명에서 부분 일치)
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { instructor: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    // 카테고리 필터
    if (category) {
      where.categories = {
        some: { slug: category },
      };
    }

    // 가격 범위 필터
    if (priceRange) {
      const priceConditions: any = {};

      if (priceRange.min !== undefined) {
        priceConditions.gte = priceRange.min;
      }

      if (Object.keys(priceConditions).length > 0) {
        where.price = priceConditions;
      }
    }

    // 정렬 조건
    const orderBy: Prisma.CourseOrderByWithRelationInput = {};
    if (sortBy === 'price') {
      orderBy.price = order as 'asc' | 'desc';
    }

    // 페이지네이션 계산
    const skip = (page - 1) * pageSize;
    const totalItems = await this.prisma.client.course.count({ where });

    // 강의 목록 조회
    const courses = await this.prisma.client.course.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        categories: true,
        instructor: {
          select: { id: true, name: true },
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
    });

    // 페이지네이션 정보 계산
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      courses: courses as any[],
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        hasNext,
        hasPrev,
      },
    };
  }

  async addFavorite(courseId: string, userId: string): Promise<boolean> {
    try {
      const existingFavorite =
        await this.prisma.client.courseFavorite.findFirst({
          where: { userId, courseId },
        });

      if (existingFavorite) {
        return true;
      }

      await this.prisma.client.courseFavorite.create({
        data: { userId, courseId },
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async removeFavorite(courseId: string, userId: string): Promise<boolean> {
    try {
      const existingFavorite =
        await this.prisma.client.courseFavorite.findFirst({
          where: { userId, courseId },
        });

      if (existingFavorite) {
        await this.prisma.client.courseFavorite.delete({
          where: { id: existingFavorite.id },
        });

        return true;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getFavorite(
    courseId: string,
    userId?: string,
  ): Promise<GetFavoriteResponseDto> {
    const course = await this.prisma.client.course.findUnique({
      where: { id: courseId },
      include: {
        _count: {
          select: { favorites: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`${courseId} 코스를 찾지 못했습니다.`);
    }

    if (userId) {
      const existingFavorite =
        await this.prisma.client.courseFavorite.findFirst({
          where: { userId, courseId },
        });

      return {
        isFavorites: !!existingFavorite,
        favoriteCount: course._count.favorites,
      };
    } else {
      return {
        isFavorites: false,
        favoriteCount: course._count.favorites,
      };
    }
  }

  async getMyFavorites(userId: string): Promise<CourseFavoriteEntity[]> {
    const existingFavorites = await this.prisma.client.courseFavorite.findMany({
      where: { userId },
    });

    return existingFavorites as unknown as CourseFavoriteEntity[];
  }
}
