import { notFound } from "next/navigation";

import * as api from "@/lib/api";

import { CurriculumUI } from "@/features/course/curriculum/ui";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (!course.data || course.error) {
    notFound();
  }

  return <CurriculumUI initialCourse={course.data} />;
};

export default Page;
