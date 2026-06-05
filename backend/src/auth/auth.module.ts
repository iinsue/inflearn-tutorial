import { Module } from '@nestjs/common';
import { AccessTokenGuard } from './guards/access-token.guard';
import { JwtVerifierService } from './services/jwt-verifier.service';

@Module({
  providers: [JwtVerifierService, AccessTokenGuard],
  exports: [JwtVerifierService, AccessTokenGuard],
})
export class AuthModule {}
