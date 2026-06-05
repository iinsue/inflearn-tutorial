import { Express } from 'express';
import { JWTPayload } from 'jose';
import { User } from 'generated/prisma/client';

// better-auth의 표준 유저 스키마 정의
export type BetterAuthJWTPayload = User & JWTPayload;

declare global {
  namespace Express {
    interface User extends BetterAuthJWTPayload {}
  }
}
