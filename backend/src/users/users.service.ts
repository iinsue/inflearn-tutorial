import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    return this.prisma.client.user.findUnique({
      where: { id: userId },
    });
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    return this.prisma.client.user.update({
      where: { id: userId },
      data: { ...updateUserDto },
    });
  }
}
