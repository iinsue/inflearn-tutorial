import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "./auth";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
};

/** Server Component / Route Handler에서 JWT 발급 (세션 쿠키를 headers로 전달) */
export const getJwtToken = async () => {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  return token;
};
