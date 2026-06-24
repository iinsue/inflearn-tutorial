"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CourseDetailDto,
  CourseReview,
  Lecture,
  Section,
  User,
} from "@/generated/openapi-client";
import { getLevelText } from "@/lib/level";
import { cn } from "@/lib/utils";
import {
  LockIcon,
  PlayCircleIcon,
  ShoppingCartIcon,
  StarIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

/**
 * 헬퍼 유틸 - 분:초 표기
 * @param seconds Type: number
 */
const formatSecondsToMinSec = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
};

/**
 * 헬퍼 유틸 - x시간 x분 표기
 * @param seconds Type: number
 */
const formatSecondsToHourMin = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours === 0) return `${minutes}분`;
  return `${hours}시간 ${minutes}분`;
};

/**
 * 헬퍼 유틸 - 날짜 표기
 * @param date Type: string
 */
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const mockInstructorStats = {
  students: 1234,
  reviews: 56,
  courses: 3,
  answers: 10,
};

/**
 * 서브 컴포넌트 - 별점
 * @param rating Type: number
 */
const StarRating = ({ rating }: { rating: number }) => {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={cn(
            "size-4",
            i < rounded
              ? "fill-yellow-400 stroke-yellow-400"
              : "stroke-muted-foreground",
          )}
        />
      ))}
    </div>
  );
};

/**
 * 서브 컴포넌트 - 헤더
 * @param course Type: CourseDetailDto
 */
const Header = ({ course }: { course: CourseDetailDto }) => {
  return (
    <header className="relative text-white rounded-md p-8 flex flex-col-reverse md:flex-row md:items-center gap-6">
      <div className="absolute bg-[#0F1415] top-0 bottom-0 w-screen left-1/2 -translate-x-1/2 -z-10" />

      {/* Left */}
      <div className="flex-1">
        {course.categories?.[0] && (
          <p className="text-sm text-muted-foreground mb-1">
            {course.categories[0].name}
          </p>
        )}

        <h1 className="text-3xl md:text-4xl font-bold mb-3">{course.title}</h1>
        {course.shortDescription && (
          <p className="text-lg text-muted-foreground mb-4">
            {course.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
          <StarRating rating={course.averageRating} />
          <span className="font-medium">{course.averageRating.toFixed(1)}</span>
          <span className="text-muted-foreground">
            ({course.totalReviews}개 수강평)
          </span>
          <span className="hidden md:inline">&#183;</span>
          <span>수강생 {course.totalEnrollments.toLocaleString()}명</span>
        </div>

        <p className="text-sm text-muted-foreground">
          by {course.instructor.name}
        </p>
      </div>

      {/* Thumbnail */}
      {course.thumbnailUrl && (
        <div className="relative w-full md:w-64 shrink-0">
          <Image
            src={course.thumbnailUrl}
            alt={course.title}
            width={256}
            height={144}
            className="rounded-md w-full h-auto object-cover"
          />

          {/* Play button overlay */}
          <button
            className="absolute inset-0 flex items-center justify-center"
            aria-label="preview"
          >
            <PlayCircleIcon className="size-16 text-white/90 drop-shadow-lg" />
          </button>
        </div>
      )}
    </header>
  );
};

/**
 * 서브 컴포넌트 - 최근 리뷰
 * @param reviews Type: CourseReview[]
 */
const LatestReviews = ({ reviews }: { reviews: CourseReview[] }) => {
  if (!reviews.length) return null;

  const latest = [...reviews]
    .sort((a, b) => {
      const dateB = new Date(b.createdAt).getTime();
      const dateA = new Date(a.createdAt).getTime();
      return dateB - dateA;
    })
    .slice(0, 4);

  // grid positions for 4 quadrants
  const positions: [number, number][] = [
    [1, 1],
    [2, 1],
    [1, 2],
    [2, 2],
  ];

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">최근 리뷰</h3>

      <div
        className={cn(
          "grid grid-cols-2 gap-4",
          latest.length > 2 && "grid-rows-2",
        )}
      >
        {latest.map((review, idx) => {
          const [col, row] = positions[latest.length === 1 ? 0 : idx];

          return (
            <div
              key={review.id}
              style={{ gridColumnStart: col, gridRowStart: row }}
              className="border rounded-md p-4 flex flex-col gap-2 bg-background"
            >
              <div className="flex items-center gap-2">
                {review.user?.image && (
                  <Image
                    src={review.user.image}
                    alt={review.user.name || "user"}
                    width={24}
                    height={24}
                    className="rounded-full object-cover"
                  />
                )}

                <span className="text-sm font-medium">
                  {review.user?.name ?? "익명"}
                </span>

                <StarRating rating={review.rating} />
              </div>

              <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
                {review.content}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/**
 * 서브 컴포넌트 - 소개
 * @param course Type: CourseDetailDto
 */
const Introduction = ({ course }: { course: CourseDetailDto }) => {
  return (
    <section id="introduction">
      <h2 className="text-2xl font-bold mb-6">강의 소개</h2>

      <LatestReviews reviews={course.reviews} />

      {course.description && (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: course.description }}
        />
      )}
    </section>
  );
};

/**
 * 서브 컴포넌트 - 세부강의
 * @param lecture Type: Lecture
 * @param className Type: string - Optional
 */
const LectureRow = ({
  lecture,
  className,
}: {
  lecture: Lecture;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between text-sm px-4 py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {lecture.isPreview ? (
          <PlayCircleIcon className="size-4 text-primary" />
        ) : (
          <LockIcon className="size-4 text-muted-foreground" />
        )}
        <span>{lecture.title}</span>
      </div>

      <div className="flex items-center gap-2">
        {lecture.isPreview && (
          <button
            className="cursor-pointer text-sm px-2 py-1 border border-gray-400 text-gray-800 font-semibold rounded-md"
            onClick={() => toast.info("구현 예정", { position: "top-center" })}
          >
            미리보기
          </button>
        )}

        <span>{formatSecondsToMinSec(lecture.duration ?? 0)}</span>
      </div>
    </div>
  );
};

/**
 * 서브 컴포넌트 - 커리큘럼
 * @param sections Type: Section[]
 */
const Curriculum = ({ sections }: { sections: Section[] }) => {
  return (
    <section id="curriculum" className="mt-12">
      <h2 className="text-2xl font-bold mb-6">커리큘럼</h2>
      <div className="border rounded-md bg-[#F8F9FA] overflow-hidden">
        <Accordion type="multiple" className="w-full">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b last:border-b-0"
            >
              <AccordionTrigger>
                <span>{section.title}</span>
                <span>{section.lectures.length}개</span>
              </AccordionTrigger>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

/**
 * 서브 컴포넌트 - 수강평(리뷰)
 * @param reviews Type: CourseReview[]
 */
const ReviewsSection = ({ reviews }: { reviews: CourseReview[] }) => {
  if (!reviews.length) return null;
  return (
    <section id="reviews" className="mt-12">
      <h2 className="text-2xl font-bold mb-6">수강평</h2>
      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="space-y-4">
            <div className="flex items-center gap-4">
              {review.user?.image && (
                <Image
                  src={review.user.image}
                  alt={review.user.name || "user"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}

              <div>
                <p className="font-medium">{review.user?.name ?? "익명"}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <StarRating rating={review.rating} />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>

            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {review.content}
            </p>
            {review.instructorReply && (
              <div className="ml-10 border-l-2 pl-4 border-primary">
                <p className="font-medium mb-1 text-primary">지식공유자 답변</p>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {review.instructorReply}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/**
 * 서브 컴포넌트 - 지식공유자 소개
 * @param instructor Type: User
 */
const InstructorBio = ({ instructor }: { instructor: User }) => {
  return (
    <>
      <hr className="border-t border-gray-200 my-12" />
      <section id="instructor">
        <h2 className="text-2xl font-bold mb-6">지식공유자 소개</h2>
        <div className="flex gap-4">
          {instructor.image && (
            <Image
              src={instructor.image}
              alt={instructor.name || "instructor"}
              width={80}
              height={80}
              className="rounded-full object-cover size-20"
            />
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">{instructor.name}</h3>
            {instructor.bio && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: instructor.bio }}
              />
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-4">
              <span>
                수강생 {mockInstructorStats.students.toLocaleString()}명
              </span>
              <span>수강평 {mockInstructorStats.reviews} 개</span>
              <span>답변 {mockInstructorStats.answers} 개</span>
              <span>강의 {mockInstructorStats.courses} 개</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

/**
 * 서브 컴포넌트 - 서브 메뉴
 * @param course Type: CourseDetailDto
 */
const FloatingMenu = ({ course }: { course: CourseDetailDto }) => {
  const handleCart = () => {
    toast.info("장바구니 기능은 준비 중입니다.", { position: "top-center" });
  };

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start lg:block hidden">
      <div className="border rounded-md w-80">
        <div className="p-6 space-y-4">
          {/* 가격 */}
          <div>
            {course.discountPrice ? (
              <>
                <span className="ml-2 line-through text-muted-foreground">
                  {course.price.toLocaleString()}원
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {course.price.toLocaleString()}원
              </span>
            )}
          </div>

          <button className="w-full py-2 px-4 rounded-md bg-primary text-white font-semibold">
            수강신청 하기
          </button>

          <button
            className="w-full py-2 px-4 rounded-md border font-medium"
            onClick={handleCart}
          >
            바구니에 담기
          </button>

          <button
            disabled
            className="w-full py-2 px-4 rounded-md border font-medium text-muted-foreground cursor-not-allowed"
          >
            즐겨찾기 (준비중)
          </button>
        </div>

        {/* info section */}
        <div className="bg-[#F8F9FA] p-6 space-y-1 text-sm rounded-b-md">
          <p>
            <strong>지식공유자:</strong>
            {course.instructor.name}
          </p>

          <p>
            <strong>강의 수:</strong>
            {course.totalLectures}개
          </p>

          <p>
            <strong>강의 시간:</strong>
            {formatSecondsToHourMin(course.totalDuration)}
          </p>

          <p>
            <strong>난이도:</strong>
            {getLevelText(course.level)}
          </p>
        </div>
      </div>
    </aside>
  );
};

/**
 * 서브 컴포넌트 - 모바일 하단 메뉴
 * @param course Type:CourseDetailDto
 */
const MobileBottomBar = ({ course }: { course: CourseDetailDto }) => {
  const handleCart = () => {
    toast.info("장바구니 기능은 준비중입니다.", { position: "top-center" });
  };

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 border-t bg-background flex items-center gap-4 px-4 py-3 z-50 shadow">
      <div className="flex-1">
        {course.discountPrice ? (
          <>
            <span className="font-bold text-lg text-primary">
              {course.discountPrice.toLocaleString()}원
            </span>

            <span className="ml-2 line-through text-muted-foreground text-sm">
              {course.price.toLocaleString()}원
            </span>
          </>
        ) : (
          <span className="font-bold text-lg">
            {course.price.toLocaleString()}원
          </span>
        )}
      </div>

      <button className="flex-1 py-2 rounded-md bg-primary text-white font-semibold">
        수강신청
      </button>

      <button
        className="p-2 rounded-md border font-medium"
        aria-label="장바구니에 담기"
        onClick={handleCart}
      >
        <ShoppingCartIcon className="size-5" />
      </button>
    </div>
  );
};

interface Props {
  course: CourseDetailDto;
}

/**
 * 메인 컴포넌트
 * @param course Type: Course(코스 정보)
 */
export const CouseDetailUI = ({ course }: Props) => {
  return (
    <div className="mx-auto px-4 py-12 pb-24 lg:pb-12">
      <Header course={course} />

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10">
        {/* Main content */}
        <div className="max-w-3xl">
          <Introduction course={course} />
          <InstructorBio instructor={course.instructor} />
          <Curriculum sections={course.sections} />
          <ReviewsSection reviews={course.reviews} />
        </div>

        {/* Floating Menu */}
        <FloatingMenu course={course} />
      </div>

      {/* 모바일 하단 바 */}
      <MobileBottomBar course={course} />
    </div>
  );
};
