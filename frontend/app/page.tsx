import { SignOut } from "@/features/auth/components/sign-out";
import { requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  await requireAuth();

  return (
    <div className="">
      <SignOut />
    </div>
  );
}
