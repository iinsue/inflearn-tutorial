"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2Icon, XIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as api from "@/lib/api";

import { Course } from "@/generated/openapi-client";

import { Button } from "@/components/ui/button";

interface Props {
  course: Course;
}

export const EditCourseHeader = ({ course }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const publishCourseMutation = useMutation({
    mutationFn: () =>
      api.updateCourse(course.id, {
        status: "PUBLISHED",
      }),

    onSuccess: () => {
      toast.success("강의가 성공적으로 게시되었습니다.");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["course", course.id],
      });
    },

    onError: () => {
      toast.error("강의 게시에 실패했습니다.");
    },
  });

  const isInvalid =
    publishCourseMutation.isPending || course.status === "PUBLISHED";

  const onSubmit = () => {
    publishCourseMutation.mutate();
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-background">
      <h2 className="text-2xl font-bold">{course.title}</h2>
      <div className="flex items-center gap-2">
        <Button
          size="lg"
          disabled={isInvalid}
          className="px-6"
          onClick={onSubmit}
        >
          {publishCourseMutation.isPending && (
            <Loader2Icon size={20} className="animate-spin mr-2" />
          )}

          {course.status === "PUBLISHED" && <span>제출완료</span>}
          {course.status === "DRAFT" && <span>제출하기</span>}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => router.push("/instructor/courses")}
        >
          <XIcon size={20} />
        </Button>
      </div>
    </header>
  );
};
