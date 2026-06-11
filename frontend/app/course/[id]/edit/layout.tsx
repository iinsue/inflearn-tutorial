import * as api from "@/lib/api";

import { EditCourseHeader } from "@/features/course/edit-header";
import { notFound } from "next/navigation";
import { EditCourseSidebar } from "@/features/course/edit-sidebar";

interface Props {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const Layout = async ({ children, params }: Props) => {
  const { id } = await params;
  const course = await api.getCourseById(id);

  if (course.error || !course.data) {
    notFound();
  }

  return (
    <div className="w-full h-full bg-[#F1F3F5]">
      <EditCourseHeader title={course.data?.title} />
      <div className="p-12 flex gap-12 min-h-screen">
        <EditCourseSidebar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
