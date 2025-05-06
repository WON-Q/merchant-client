"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/api/auth/useAuth";

// 로그인 폼 유효성 검증 스키마
const loginFormSchema = z.object({
  accountId: z.string().min(1, {
    message: "아이디를 입력해주세요.",
  }),
  password: z.string().min(1, {
    message: "비밀번호를 입력해주세요.",
  }),
});

// 폼 타입 정의
type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard"; // 미들웨어에서 설정한 리디렉션 경로 가져오기
  const [credentialError, setCredentialError] = useState<string | null>(null);

  // useAuth 커스텀 훅 사용
  const { login, isLoggingIn, isAuthenticated } = useAuth();

  // 폼 초기화
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      accountId: "",
      password: "",
    },
  });

  // 이미 인증된 사용자는 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // 폼 제출 핸들러
  const onSubmit = async (data: LoginFormValues) => {
    // 에러 상태 초기화
    setCredentialError(null);

    try {
      const result = await login(data.accountId, data.password);

      if (result.success) {
        // 로그인 성공 시 리디렉션 경로로 이동
        router.push(redirect);
      } else {
        // 로그인 실패 시 자격 증명 오류 설정
        setCredentialError(result.errorMessage || "로그인에 실패했습니다.");

        // 성공적이지 않을 때 폼 상태를 수동으로 오류 상태로 설정
        form.setError("accountId", {
          type: "manual",
          message: "", // 실제 메시지는 credentialError로 관리
        });
        form.setError("password", {
          type: "manual",
          message: "", // 실제 메시지는 credentialError로 관리
        });
      }
    } catch (error) {
      console.error("로그인 처리 중 오류:", error);
      setCredentialError(
        "로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* 상단 네비게이션 */}
      <div className="container py-4 px-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          홈으로 돌아가기
        </Link>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* 로그인 카드 */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-neutral-100">
            <h2 className="text-xl font-semibold text-neutral-800 mb-6">
              가맹점 로그인
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* 아이디 입력 필드 */}
              <div>
                <Input
                  id="accountId"
                  label="아이디"
                  type="text"
                  leftIcon={<User className="h-4 w-4 text-neutral-400" />}
                  placeholder="아이디를 입력하세요"
                  isError={
                    !!form.formState.errors.accountId || !!credentialError
                  }
                  errorMessage={form.formState.errors.accountId?.message}
                  disabled={isLoggingIn}
                  {...form.register("accountId")}
                />
              </div>

              {/* 비밀번호 입력 필드 */}
              <div>
                <Input
                  id="password"
                  label="비밀번호"
                  type="password"
                  leftIcon={<Lock className="h-4 w-4 text-neutral-400" />}
                  placeholder="비밀번호를 입력하세요"
                  isError={
                    !!form.formState.errors.password || !!credentialError
                  }
                  errorMessage={
                    form.formState.errors.password?.message ||
                    (credentialError &&
                    !form.formState.errors.accountId?.message
                      ? credentialError
                      : "")
                  }
                  disabled={isLoggingIn}
                  {...form.register("password")}
                />
              </div>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoggingIn}
                loadingText="로그인 중..."
              >
                로그인
              </Button>

              {/* 회원가입 및 비밀번호 찾기 링크 */}
              <div className="pt-4 text-center border-t border-neutral-100">
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-6 text-sm">
                  <Link
                    href="/register"
                    className="text-[#FF6B35] hover:text-[#E55A24] hover:underline transition-colors font-medium"
                  >
                    회원가입
                  </Link>
                  <span className="hidden sm:inline text-neutral-300">|</span>
                  <Link
                    href="/forgot-password"
                    className="text-neutral-500 hover:text-neutral-700 hover:underline transition-colors"
                  >
                    비밀번호를 잊으셨나요?
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* 하단 정보 */}
          <div className="mt-8 text-center">
            <p className="text-xs text-neutral-500">
              © 2025 WonQ Order. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
