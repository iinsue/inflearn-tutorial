import { Metadata } from "next";
import { notFound } from "next/navigation";

import * as api from "@/lib/api";

import { EditCourseUI } from "@/features/course/edit";

export const metadata: Metadata = {
  title: "강의 정보 편집 - 인프런",
  description: "인프런 강의 정보 편집 페이지입니다.",
};

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);
  if (!course.data || course.error) {
    notFound();
  }

  return <EditCourseUI course={course.data} />;
};

export default Page;
