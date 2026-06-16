import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CoursesModule } from './courses/courses.module';
import { LecturesModule } from './lectures/lectures.module';
import { SectionsModule } from './sections/sections.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    CoursesModule,
    SectionsModule,
    LecturesModule,
    CategoriesModule,
    MediaModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
