import { LevelType, StatusType } from '@prisma/client';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {
  // @ApiProperty는 사용 시 실제 Swagger 문서에도 해당 타이틀에 대한 설명이 따라붙음
  // @IsString은 해당 DTO 값을 검증할 때 사용하는 class-validator의 클래스
  // @IsUUID의 경우 버전을 처음에 명시하는데 값을 넣을 필요없기 때문에 undefined를 할당

  @ApiProperty({ description: '코스 슬러그(URL에 사용)', required: false })
  @IsString()
  slug: string;

  @ApiProperty({ description: '코스 1~2줄 짧은 설명', required: false })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ description: '강의 상태', required: false })
  @IsString()
  @IsOptional()
  status?: StatusType;

  @ApiProperty({ description: '코스 상세페이지 설명', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '썸네일 이미지 URL', required: false })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ description: '코스 가격', required: false })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '코스 할인 가격', required: false })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ description: '코스 난이도', required: false })
  @IsString()
  level: LevelType;

  @ApiProperty({ description: '코스 게시여부', required: false })
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ description: '코스 카테고리 ID 목록', required: false })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds: string[];
}
