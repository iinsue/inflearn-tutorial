import { ApiProperty } from '@nestjs/swagger';
import { type LevelType } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ description: '코스 제목' })
  @IsString()
  title: string;

  @ApiProperty({ description: '코스 슬러그(URL에 사용)' })
  @IsString()
  slug: string;

  @ApiProperty({ description: '코스 1~2줄 짧은 설명' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ description: '코스 상세페이지 설명' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '썸네일 이미지 URL' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({ description: '코스 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '코스 할인 가격' })
  @IsNumber()
  @IsOptional()
  discountPrice?: number;

  @ApiProperty({ description: '코스 난이도' })
  @IsString()
  level: LevelType;

  @ApiProperty({ description: '코스 게시여부' })
  @IsBoolean()
  isPublished: boolean;

  @ApiProperty({ description: '코스 카테고리 ID 목록' })
  @IsArray()
  @IsUUID(undefined, { each: true })
  @IsOptional()
  categoryIds: string[];
}
