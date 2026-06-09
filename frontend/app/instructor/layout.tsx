import { InstructorSidebar } from "@/features/instructor/components/instructor-sidebar";
import { InstructorPageName } from "@/features/instructor/components/instructor-page-name";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <div className="flex flex-col">
      {/* 제목 */}
      <InstructorPageName />
      <div className="flex w-6xl mx-auto">
        <InstructorSidebar />
        {children}
      </div>
    </div>
  );
};
export default Layout;
