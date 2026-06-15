import { notFound } from "next/navigation";

import * as api from "@/lib/api";
import { DescriptionBuilderUI } from "@/features/course/description-builder/ui";

interface Props {
  params: Promise<{ id: string }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);
  if (!course.data || course.error) {
    notFound();
  }

  return <DescriptionBuilderUI course={course.data} />;
};

export default Page;
