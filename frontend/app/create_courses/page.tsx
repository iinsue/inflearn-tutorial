import { Metadata } from "next";

import { CreateCourseUI } from "@/features/course/create";

export const metadata: Metadata = {
  title: "강의 생성 - 인프런",
  description: "인프런 강의 생성 페이지입니다.",
};

const Page = () => {
  return <CreateCourseUI />;
};

export default Page;
