import { notFound } from "next/navigation";

import * as api from "@/lib/api";
import { CouseDetailUI } from "@/features/course/detail/ui";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (!course.data || course.error) {
    notFound();
  }

  return <CouseDetailUI course={course.data} />;
};

export default Page;
