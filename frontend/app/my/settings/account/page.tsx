import * as api from "@/lib/api";
import { AccountUI } from "@/features/my/account/ui";

const Page = async () => {
  const profile = await api.getProfile();

  if (!profile.data || profile.error) {
    return <div>프로필이 존재하지 않습니다.</div>;
  }

  return <AccountUI profile={profile.data} />;
};

export default Page;
