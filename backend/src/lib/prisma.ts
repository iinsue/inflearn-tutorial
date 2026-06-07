import pg from 'pg';
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// 1. PostgreSQL 연결 풀(Pool) 생성
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Prisma 전용 pg 어댑터 생성
const adapter = new PrismaPg(pool);

// 3. 어댑터를 주입하여 PrismaClient 인스턴스 생성
const prisma = new PrismaClient({ adapter });

export { prisma };
