import { Injectable, OnModuleInit } from '@nestjs/common';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class PrismaService implements OnModuleInit {
  /**
   * Prisma Module이 처음 떠서 초기화 될 때
   * connect 함수를 통해서 DB를 연결해주는 서비스
   * 이렇게 하면 다른 곳에서 PrismaService를 PrismaClient 처럼 가져다 쓸 수 있습니다.
   */

  // 이미 생성된 인스턴스를 다른 서비스에서 쓸 수 있도록 속성으로 등록합니다.
  public readonly client = prisma;

  async onModuleInit() {
    // 라이프사이클 관리만 NestJS에게 맡깁니다.
    await this.client.$connect();
  }
}
