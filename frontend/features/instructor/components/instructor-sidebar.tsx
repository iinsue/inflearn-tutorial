"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const sidebarItems = [
  {
    label: "대시보드",
    href: "/instructor",
  },
  {
    label: "새 강의 만들기",
    href: "/create_courses",
  },
  {
    label: "강의 관리",
    href: "/instructor/courses",
  },
  {
    label: "미션 관리",
    href: "/instructor#",
  },
  {
    label: "멘토링 관리",
    href: "/instructor#",
  },
  {
    label: "강의 질문 관리",
    href: "/instructor#",
  },
  {
    label: "수강평 리스트",
    href: "/instructor#",
  },
  {
    label: "새소식 관리",
    href: "/instructor#",
  },
  {
    label: "수익 확인",
    href: "/instructor#",
  },
  {
    label: "쿠폰 관리",
    href: "/instructor#",
  },
];

export const InstructorSidebar = () => {
  const pathname = usePathname();
  const [selectedTab, setSelectedTab] = useState("");

  const alertPreparing = () => {
    toast.info("준비중입니다.");
  };

  return (
    <aside className="w-full max-w-[260px] flex flex-col gap-2 p-4 border-r min-h-screen">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        const isPreparing = item.href.endsWith("#");

        return (
          <Button
            key={item.label}
            variant="link"
            className={cn(
              "justify-start w-full text-base font-medium",
              isActive && "text-green-700",
            )}
            asChild={!isPreparing}
          >
            {isPreparing ? (
              <span>{item.label}</span>
            ) : (
              <a href={item.href}>{item.label}</a>
            )}
          </Button>
        );
      })}
    </aside>
  );
};
