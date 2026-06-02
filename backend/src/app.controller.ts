import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { prisma } from './lib/prisma';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    prisma.test.create({
      data: {
        id: '1',
      },
    });

    return this.appService.getHello();
  }
}
