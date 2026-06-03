import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
});
