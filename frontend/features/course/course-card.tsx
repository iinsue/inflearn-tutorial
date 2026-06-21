"use client";

import { toast } from "sonner";
import Image from "next/image";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";

import { Course } from "@/generated/openapi-client";
import { Button } from "@/components/ui/button";

interface Props {
  course: Course;
}

const getLevelText = (level: string): string => {
  switch (level.toUpperCase()) {
    case "BEGINNER":
      return "입문";
    case "INTERMEDIATE":
      return "초급";
    case "ADVANCED":
      return "중급";
    default:
      return level;
  }
};

export const CourseCard = ({ course }: Props) => {
  const handleFavoriteClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    toast.info("구현 예정", { position: "top-center" });
  };

  const handleCartClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    toast.info("구현 예정", { position: "top-center" });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const calculateDiscountPercentage = (
    originalPrice: number,
    disCountPrice: number,
  ): number => {
    return Math.round(((originalPrice - disCountPrice) / originalPrice) * 100);
  };

  return (
    <div className="group relative cursor-pointer overflow-hidden bg-background transition-all durtaion-300">
      {/* 썸네일 이미지 */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnailUrl || "/placeholder-course.jpg"}
          alt={course.title}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-md object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* 호버 시 보이는 액션 버튼들 */}
        <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            className="size-8 p-0 enabled:cursor-pointer"
            onClick={handleFavoriteClick}
          >
            <HeartIcon className="size-4" />
          </Button>

          <Button
            size="sm"
            variant="secondary"
            className="size-8 p-0 enabled:cursor-pointer"
            onClick={handleCartClick}
          >
            <ShoppingCartIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* 강의 정보 */}
      <div className="py-2">
        <h3
          className="mb-2 text-md font-semibold text-gray-900 overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {course.title}
        </h3>

        {course.shortDescription && (
          <p
            className="mb-3 text-xs text-gray-600 overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {course.shortDescription}
          </p>
        )}

        {/* 레벨 및 강사 정보 */}
        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="rounded bg-gray-100 px-2 py-1">
            {getLevelText(course.level)}
          </span>
          <span>{course.instructor?.name || "강사명"}</span>
        </div>

        {/* 가격 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {course.discountPrice && course.discountPrice < course.price ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₩{formatPrice(course.price)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                    {calculateDiscountPercentage(
                      course.price,
                      course.discountPrice,
                    )}
                    % 할인
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    ₩{formatPrice(course.discountPrice)}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-sm font-bold text-gray-900">
                ₩{formatPrice(course.price)}
              </span>
            )}
          </div>

          {/* 평점 정보 (임시로 하드코딩) */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">4.8</span>
            <span className="text-gray-400">(213)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
