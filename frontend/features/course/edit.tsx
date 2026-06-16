"use client";

import z from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LevelType, StatusType } from "@prisma/client";

import * as api from "@/lib/api";

import { Course } from "@/generated/openapi-client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface Props {
  course: Course;
}

const formSchema = z.object({
  title: z.string().min(1, "제목을 입력하세요"),
  shortDescription: z.string(),
  price: z.string(),
  discountPrice: z.string(),
  level: z.enum(LevelType),
  status: z.enum(StatusType),
  slug: z.string(),
});

type FormType = z.infer<typeof formSchema>;

export const EditCourseUI = ({ course }: Props) => {
  const updateCourseMutation = useMutation({
    mutationFn: (data: FormType) =>
      api.updateCourse(course.id, {
        ...data,
        price: parseInt(data.price),
        discountPrice: parseInt(data.price),
      }),
    onSuccess: () => {
      toast.success("강의 정보가 성공적으로 업데이트 되었습니다.");
    },
  });

  const onSubmit = (data: FormType) => {
    updateCourseMutation.mutate(data);
  };

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: course.title,
      shortDescription: course.shortDescription ?? "",
      price: course.price?.toString() ?? "0",
      discountPrice: course.discountPrice?.toString() ?? "0",
      level: course.level,
      status: course.status,
      slug: course.slug ?? "",
    },
  });

  return (
    <div className="w-full">
      <form id="edit-course-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-8 p-8 rounded-lg shadow bg-background">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-course-title">
                  <span>강의 제목</span>
                  <span className="text-red-500">*</span>
                </FieldLabel>

                <Input
                  {...field}
                  id="edit-course-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="강의 제목을 입력하세요"
                  autoComplete="off"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="shortDescription"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-course-short-description">
                  <span>강의 두줄 요약</span>
                  <span className="text-red-500">*</span>
                </FieldLabel>

                <FieldDescription className="text-xs text-red-500 mb-1">
                  강의소개 상단에 보여집니다. 잠재 수강생들이 매력을 느낄만한
                  글을 짧게 남겨주세요.
                </FieldDescription>

                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="edit-course-short-description"
                    placeholder="ex) 이 강의를 통해 수강생은 컴퓨터 공학의 기초를 다질 수 있을 것으로 예상합니다."
                    aria-invalid={fieldState.invalid}
                    rows={3}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length} 글자
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="price"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-course-discount-price">
                  <span>강의 가격</span>
                  <span className="text-red-500">*</span>
                </FieldLabel>

                <Input
                  {...field}
                  type="number"
                  id="edit-course-discount-price"
                  placeholder="0"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  required
                  min={0}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="discountPrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-course-discount-price">
                  강의 할인 가격
                </FieldLabel>

                <Input
                  {...field}
                  type="number"
                  id="edit-course-discount-price"
                  placeholder="할인 가격이 있다면 입력하세요"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                  min={0}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="level"
            render={({ fieldState, field }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="edit-course-level">
                  <span>난이도</span>
                  <span className="text-red-500">*</span>
                </FieldLabel>

                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  defaultValue="BEGINNER"
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2 *:cursor-pointer">
                    <RadioGroupItem
                      id="level-beginner"
                      value="BEGINNER"
                      aria-invalid={fieldState.invalid}
                    />
                    <Label htmlFor="level-beginner" className="mr-4">
                      입문
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 *:cursor-pointer">
                    <RadioGroupItem
                      id="level-intermediate"
                      value="INTERMEDIATE"
                      aria-invalid={fieldState.invalid}
                    />
                    <Label htmlFor="level-intermediate" className="mr-4">
                      초급
                    </Label>
                  </div>

                  <div className="flex items-center gap-2 *:cursor-pointer">
                    <RadioGroupItem
                      id="level-advanced"
                      value="ADVANCED"
                      aria-invalid={fieldState.invalid}
                    />
                    <Label htmlFor="level-advanced" className="mr-4">
                      중급
                    </Label>
                  </div>
                </RadioGroup>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="status"
            render={({ field, fieldState }) => {
              return (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    <span>공개여부</span>
                    <span className="text-red-500">*</span>
                  </FieldLabel>

                  <div className="flex items-center gap-2 *:cursor-pointer">
                    <Switch
                      id="edit-course-status"
                      name={field.name}
                      checked={field.value === "PUBLISHED"}
                      onCheckedChange={(value) =>
                        value
                          ? field.onChange("PUBLISHED")
                          : field.onChange("DRAFT")
                      }
                      aria-invalid={fieldState.invalid}
                    />
                    <Label htmlFor="edit-course-status">공개</Label>
                  </div>
                </Field>
              );
            }}
          />

          <Button type="submit" form="edit-course-form">
            저장하기
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
};
