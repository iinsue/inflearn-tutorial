"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import Link from "next/link";

const registerSchema = z
  .object({
    email: z.email("이메일을 입력하세요"),
    password: z.string().min(1, "비밀번호를 입력하세요"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    error: "비밀번호와 일치하지 않습니다",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (values: RegisterFormValues) => {
    await authClient.signUp.email(
      {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center">
      <Card className="min-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">회원가입</CardTitle>
          <CardDescription className="text-gray-700">
            인프런에서 다양한 학습의 기회를 얻으세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid gap-6">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signup-email">이메일</FieldLabel>
                      <Input
                        id="signup-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="abc@exmaple.com"
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signup-password">
                        비밀번호
                      </FieldLabel>
                      <Input
                        id="signup-password"
                        aria-invalid={fieldState.invalid}
                        type="password"
                        placeholder="********"
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signup-confirm-password">
                        비밀번호 확인
                      </FieldLabel>
                      <Input
                        id="signup-confirm-password"
                        aria-invalid={fieldState.invalid}
                        type="password"
                        placeholder="********"
                        {...field}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 enabled:cursor-pointer"
                disabled={isPending}
              >
                회원가입
              </Button>
            </FieldGroup>

            <div className="text-center text-xs mt-4">
              이미 계정이 있으신가요? &nbsp;
              <Link href="/signin" className="underline underline-offset-4">
                로그인
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
