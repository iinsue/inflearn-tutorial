import { Metadata } from "next";

import * as api from "@/lib/api";
import { CourseTable } from "@/features/instructor/components/course-table";

export const metadata: Metadata = {
  title: "강의 관리 - 인프런",
  description: "인프런 강의 관리 페이지입니다.",
};

const Page = async () => {
  const { data: courses } = await api.getAllInstructorCourses();

  return <CourseTable courses={courses ?? []} />;
};

export default Page;
