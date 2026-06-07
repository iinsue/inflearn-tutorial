import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false, // Better Auth를 위해 false 유지
  });

  // ⭐️ [중요] NestJS 내장 바디파서는 끄되, Express 수준에서 JSON 파싱을 허용해줍니다.
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ⭐️ [필수] 글로벌 파이프 등록 및 transform: true 적용
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // JSON을 DTO 클래스 인스턴스로 자동 변환해주는 옵션
      whitelist: true, // DTO에 정의되지 않은 속성은 자동으로 제거
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Inflearn API 문서')
    .setDescription('Inflearn API 문서입니다.')
    .setVersion('1.0')
    // 토큰을 입력할 수 있는 창을 추가하는 부분
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'access-token',
        description: 'Enter access token',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
