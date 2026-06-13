import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        // ~ 30MB
        fileSize: 30 * 1024 * 1024,
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
