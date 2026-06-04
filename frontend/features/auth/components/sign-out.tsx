"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export const SignOut = () => {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();

  const onSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  return (
    <div className="">
      {isPending ? <div>Loading...</div> : <div>Email: {data?.user.email}</div>}
      <Button className="enabled:cursor-pointer" onClick={onSignOut}>
        로그아웃
      </Button>
    </div>
  );
};
