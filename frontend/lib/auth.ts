import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: (user) => user.user,
        audience: process.env.BACKEND_API_URL || "http://localhost:3001",
      },
    }),
  ],
  trustedOrigins: [
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    process.env.BACKEND_API_URL || "http://localhost:3001",
  ],

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
