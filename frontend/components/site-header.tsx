"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";

import * as api from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { CATEGORY_ICONS } from "@/app/constants/category-icons";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const SiteHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: profile, isPending } = authClient.useSession();

  const { data: categories } = useQuery({
    queryFn: api.getAllCategories,
    queryKey: ["categories"],
    staleTime: Infinity,
  });

  const onSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

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
        {!profile || isPending ? (
          <Button
            variant="outline"
            className="ml-2 border-gray-200 font-semibold hover:border-[#1dc078] hover:text-[#1dc078]"
            asChild
          >
            <Link href="/signin">로그인</Link>
          </Button>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <div className="ml-2 cursor-pointer">
                <Avatar>
                  {profile.user.image ? (
                    <img
                      src={profile.user.image}
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
              <div className="border-b border-gray-100 px-4 py-3">
                <div className="font-semibold text-gray-800">
                  {profile.user.name || profile.user.email || "내 계정"}
                </div>

                {profile.user.email && (
                  <div className="mt-1 text-xs text-gray-500">
                    {profile.user.email}
                  </div>
                )}
              </div>

              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none"
                onClick={() => {
                  router.push("/my/settings/account");
                }}
              >
                <div className="font-semibold text-gray-800">프로필 수정</div>
              </button>

              <Separator />

              <Button className="mx-2 mb-4 cursor-pointer" onClick={onSignOut}>
                로그아웃
              </Button>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* 하단 카테고리 */}
      {isCategoryNeeded && (
        <div className="px-8">
          <nav className="flex gap-6 py-4 overflow-x-auto scrollbar-none justify-center">
            {categories && categories.data
              ? categories.data.map((category) => (
                  <Link key={category.id} href={`/courses/${category.slug}`}>
                    <div className="flex flex-col items-center min-w-[72px] text-muted-foreground hover:text-[#1dc078] cursor-pointer transition-colors">
                      {/* <LayersIcon size={28} className="mb-1" /> */}
                      {React.createElement(
                        CATEGORY_ICONS[category.slug] ||
                          CATEGORY_ICONS["default"],
                        { size: 28, className: "mb-1" },
                      )}

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
