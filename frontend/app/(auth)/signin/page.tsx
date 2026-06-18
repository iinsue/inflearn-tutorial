import { Metadata } from "next";

import { requireUnauth } from "@/lib/auth-utils";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "로그인 - 인프런",
  description: "인프런 로그인 페이지입니다.",
};

const Page = async () => {
  await requireUnauth();

  return <LoginForm />;
};

export default Page;
