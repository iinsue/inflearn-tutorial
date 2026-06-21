import { CourseList } from "@/features/course/course-list";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page_number?: string }>;
}

export const generateMetadta = async ({ params }: Props) => {
  const { slug } = await params;

  return {
    title: `인프런 - ${slug} 검색 결과`,
    description: `인프런에서 ${slug} 검색 결과를 찾아보세요.`,
  };
};

const Page = async ({ params, searchParams }: Props) => {
  const { slug } = await params;
  const { page_number } = await searchParams;

  return (
    <div className="p-6">
      <CourseList
        category={slug || undefined}
        page={page_number ? parseInt(page_number) : 1}
      />
    </div>
  );
};

export default Page;
