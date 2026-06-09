import { CourseTable } from "@/features/instructor/components/course-table";
import * as api from "@/lib/api";

const Page = async () => {
  const { data: courses } = await api.getAllInstructorCourses();

  return <CourseTable courses={courses ?? []} />;
};

export default Page;
