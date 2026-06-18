"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LayersIcon, SearchIcon } from "lucide-react";

import * as api from "@/lib/api";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SiteHeader = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: categories } = useQuery({
    queryFn: api.getAllCategories,
    queryKey: ["categories"],
    staleTime: Infinity,
  });

  const { data: profile } = useQuery({
    queryFn: api.getProfile,
    queryKey: ["profile"],
    staleTime: Infinity,
  });

  const isSiteHeaderNeeded = !pathname.includes("/course/");
  const isCategoryNeeded = pathname == "/" || pathname.includes("/courses");

  if (!isSiteHeaderNeeded) return null;

  return (
    <header className="w-full border-b bg-background">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-8 py-3 gap-4">
        {/* 로고 */}
        <div className="min-w-[120px]">
          <Link href="/">
            <Image
              src="/images/inflearn_public_logo.png"
              className="w-28 h-auto"
              width={120}
              height={32}
              alt="inflearn"
            />
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="flex gap-6 text-base font-bold text-accent-foreground">
          <Link href="#" className="hover:text-[#1dc078] transition-colors">
            강의
          </Link>
          <Link href="#" className="hover:text-[#1dc078] transition-colors">
            로드맵
          </Link>
          <Link href="#" className="hover:text-[#1dc078] transition-colors">
            멘토링
          </Link>
          <Link href="#" className="hover:text-[#1dc078] transition-colors">
            커뮤니티
          </Link>
        </nav>

        {/* 검색창 + 아이콘 */}
        <div className="flex-1 flex justify-center">
          <div className="relative flex w-full max-w-xl items-center">
            <Input
              type="text"
              placeholder="나의 진짜 성장을 도와줄 실무 강의를 찾아보세요"
              autoComplete="off"
              className="w-full bg-accent focus-visible:ring-[#1dc078] pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 p-1 text-muted-foreground hover:text-[#1dc078] transition-colors"
            >
              <SearchIcon size={20} />
            </button>
          </div>
        </div>

        {/* 지식공유자 버튼 */}
        <Link href="/instructor">
          <Button
            variant="outline"
            className="font-semibold border-gray-200 hover:border-[#1dc078] hover:text-[#1dc078] enabled:cursor-pointer"
          >
            지식공유자
          </Button>
        </Link>

        {/* Avatar + Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <div className="ml-2 cursor-pointer">
              <Avatar>
                {profile && profile?.data?.image ? (
                  <img
                    src={profile.data.image}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback>
                    <span role="img" aria-label="user">
                      &#x1F464;
                    </span>
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-56 p-0">
            <button
              className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none"
              onClick={() => {
                router.push("/my/settings/account");
              }}
            >
              <div className="font-semibold text-gray-800">
                {profile?.data?.name || profile?.data?.email || "내 계정"}
              </div>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      {/* 하단 카테고리 */}
      {isCategoryNeeded && (
        <div className="px-8">
          <nav className="flex gap-6 py-4 overflow-x-auto scrollbar-none justify-center">
            {categories && categories.data
              ? categories.data.map((category) => (
                  <Link key={category.id} href={`/courses/${category.slug}`}>
                    <div className="flex flex-col items-center min-w-[72px] text-muted-foreground hover:text-[#1dc078] cursor-pointer transition-colors">
                      <LayersIcon size={28} className="mb-1" />
                      <span className="text-xs font-medium whitespace-nowrap">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                ))
              : []}
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
