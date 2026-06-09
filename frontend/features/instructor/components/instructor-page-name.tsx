"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export const InstructorPageName = () => {
  const pathname = usePathname();
  const [title, setTitle] = useState("");

  useEffect(() => {
    switch (pathname) {
      case "/instructor":
        setTitle("대시보드");
        break;
      case "/instructor/courses":
        setTitle("강의 관리");
        break;
      default:
        setTitle("대시보드");
    }
  }, [pathname]);

  return (
    <div className="w-full bg-gray-700">
      <div className="w-6xl mx-auto text-2xl text-muted font-bold py-4 px-2">
        {title}
      </div>
    </div>
  );
};
