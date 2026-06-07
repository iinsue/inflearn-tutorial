import type { Express, Request } from 'express';
import type { User } from '@prisma/client';
import type { JWTPayload } from 'jose';

type BetterAuthJWTPayload = User & JWTPayload;

declare global {
  namespace Express {
    interface Request {
      user: BetterAuthJWTPayload;
    }
  }
}
