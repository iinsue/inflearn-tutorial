import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ description: '섹션 제목' })
  @IsString()
  title: string;
}
