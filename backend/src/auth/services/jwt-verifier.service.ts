import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

@Injectable()
export class JwtVerifierService {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

  private getJWKS() {
    if (!this.jwks) {
      const betterAuthUrl =
        process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

      this.jwks = createRemoteJWKSet(new URL(`${betterAuthUrl}/api/auth/jwks`));
    }

    return this.jwks;
  }

  async verifyJWT(token: string): Promise<JWTPayload> {
    try {
      const betterAuthUrl =
        process.env.BETTER_AUTH_URL ?? 'http://localhost:3000';

      const { payload } = await jwtVerify(token, this.getJWKS(), {
        issuer: betterAuthUrl,
      });

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid JWT token');
    }
  }
}
