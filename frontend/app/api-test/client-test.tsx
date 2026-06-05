"use client";

import { getUserTest } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export default function ClientTest() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user-test"],
    queryFn: () => getUserTest(),
  });

  if (isLoading) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="mt-4">
      <h2>클라이언트 컴포넌트 API 테스트 결과</h2>
      <pre>{data}</pre>
    </div>
  );
}
