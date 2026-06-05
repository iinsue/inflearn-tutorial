import { SignOut } from "@/features/auth/components/sign-out";
import { getJwtToken, requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  await requireAuth();
  const token = await getJwtToken();

  return (
    <div className="">
      <div className="break-all text-sm">{token}</div>
      <SignOut />
    </div>
  );
}
