import { Metadata } from "next";

import { getJwtToken, requireAuth } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "인프런 - 라이프타임 커리어 플랫폼",
  description: "인프런은 라이프타임 커리어 플랫폼입니다.",
};

export default async function Home() {
  await requireAuth();
  const token = await getJwtToken();

  return (
    <div className="">
      <div className="break-all text-sm">{token}</div>
    </div>
  );
}
