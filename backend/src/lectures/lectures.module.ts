import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { LecturesService } from './lectures.service';
import { LecturesController } from './lectures.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [LecturesController],
  providers: [LecturesService],
})
export class LecturesModule {}
