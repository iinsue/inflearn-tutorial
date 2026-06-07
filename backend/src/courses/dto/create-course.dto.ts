import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCourseDto {
  // @ApiProperty는 사용 시 실제 Swagger 문서에도 해당 타이틀에 대한 설명이 따라붙음
  // @IsString은 해당 DTO 값을 검증할 때 사용하는 class-validator의 클래스
  // @IsUUID의 경우 버전을 처음에 명시하는데 값을 넣을 필요없기 때문에 undefined를 할당

  @ApiProperty({ description: '코스 제목' })
  @IsString()
  title: string;
}
