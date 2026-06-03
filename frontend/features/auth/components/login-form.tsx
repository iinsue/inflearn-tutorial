"use client";

import z from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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

const loginSchema = z.object({
  email: z.email("이메일을 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email(
      {
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

  const isPending = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-4 h-screen items-center justify-center">
      <Card className="min-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">로그인</CardTitle>
          <CardDescription className="text-gray-700">
            인프런 계정으로 로그인할 수 있습니다
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
              </div>

              <Button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 enabled:cursor-pointer"
                disabled={isPending}
              >
                로그인
              </Button>
            </FieldGroup>

            <div className="text-center text-xs mt-4">
              이미 계정이 있으신가요? &nbsp;
              <Link href="/signup" className="underline underline-offset-4">
                회원가입
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
