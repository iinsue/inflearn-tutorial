import { notFound } from "next/navigation";

import * as api from "@/lib/api";

import { EditCourseUI } from "@/features/course/edit";

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
