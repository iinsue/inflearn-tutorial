import { Metadata } from "next";
import { requireUnauth } from "@/lib/auth-utils";
import { RegisterForm } from "@/features/auth/components/register-form";

export const metadata: Metadata = {
  title: "회원가입 - 인프런",
  description: "인프런 회원가입 페이지입니다.",
};

const Page = async () => {
  await requireUnauth();

  return <RegisterForm />;
};

export default Page;
