import { Module } from '@nestjs/common';

import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
