"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

interface Props {
  title: string;
}

export const EditCourseHeader = ({ title }: Props) => {
  return (
    <header className="flex justify-between items-center px-6 py-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="flex items-center gap-2">
        <Button size="lg" className="px-6">
          제출
        </Button>
        <Button size="lg" variant="outline">
          <XIcon size={20} />
        </Button>
      </div>
    </header>
  );
};
