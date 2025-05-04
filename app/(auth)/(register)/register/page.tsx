"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Star } from "lucide-react";

import Step1Terms from "@/components/auth/register/step1-terms";
import Step2Business from "@/components/auth/register/step2-business";
import Step3Store from "@/components/auth/register/step3-store";
import Step4Account from "@/components/auth/register/step4-account";
import Step5Complete from "@/components/auth/register/step5-complete";
import {
  RegisterFormData,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
} from "@/types/register";

/**
 * 가맹점 회원가입 페이지
 */
export default function RegisterPage() {
  const router = useRouter();
  const initialStep = 1;
  const [step, setStep] = useState(
    initialStep > 0 && initialStep <= 5 ? initialStep : 1
  );
  const [formData, setFormData] = useState<Partial<RegisterFormData>>({});

  /**
   * 다음 단계로 이동하는 핸들러
   */
  const handleNextStep = (
    data: Step1Data | Step2Data | Step3Data | Step4Data,
    nextStep: number
  ) => {
    setFormData({ ...formData, ...data });
    setStep(nextStep);
  };

  /**
   * 이전 단계로 이동하는 핸들러
   */
  const handlePrevStep = (prevStep: number) => {
    if (prevStep === 0) {
      router.push("/");
      return;
    }
    setStep(prevStep);
  };

  // 단계별 컴포넌트 렌더링
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1Terms
            onNext={(data: Step1Data) => handleNextStep(data, 2)}
            onPrev={() => handlePrevStep(0)}
            defaultValues={formData}
          />
        );
      case 2:
        return (
          <Step2Business
            onNext={(data: Step2Data) => handleNextStep(data, 3)}
            onPrev={() => handlePrevStep(1)}
            defaultValues={formData}
          />
        );
      case 3:
        return (
          <Step3Store
            onNext={(data: Step3Data) => handleNextStep(data, 4)}
            onPrev={() => handlePrevStep(2)}
            defaultValues={formData}
          />
        );
      case 4:
        return (
          <Step4Account
            onNext={(data: Step4Data) => handleNextStep(data, 5)}
            onPrev={() => handlePrevStep(3)}
            defaultValues={formData}
          />
        );
      case 5:
        return <Step5Complete formData={formData as RegisterFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4 sm:px-6">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              가맹점 회원가입
              <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs rounded-full px-3 py-1 font-medium">
                <Star className="inline-block w-3 h-3 mr-1" />
                사장님 전용
              </span>
            </h1>
            <p className="text-gray-500">
              가맹점 등록을 위한 정보를 입력해주세요.
            </p>
          </div>
        </div>

        {/* 단계 표시기 */}
        <div className="relative">
          <div className="hidden sm:flex justify-between items-center mb-2 relative z-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1 w-1/4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= i
                      ? "bg-[#FF6B35] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step >= i ? "text-[#FF6B35]" : "text-gray-500"
                  }`}
                >
                  {i === 1
                    ? "약관 동의"
                    : i === 2
                    ? "사업자 정보"
                    : i === 3
                    ? "매장 정보"
                    : "계좌 정보"}
                </span>
              </div>
            ))}
          </div>

          {/* 모바일 단계 표시기 */}
          <div className="sm:hidden flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  step >= i
                    ? "bg-[#FF6B35] text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > i ? <CheckCircle2 className="h-4 w-4" /> : i}
              </div>
            ))}
          </div>

          {/* 진행 바 */}
          <div className="hidden sm:block absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
            <div
              className="h-full bg-[#FF6B35] transition-all duration-300"
              style={{
                width:
                  step === 5 ? "100%" : `${Math.min((step - 1) * 33.33, 100)}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      {renderStep()}

      {step < 5 && (
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="text-[#FF6B35] font-medium hover:underline"
            >
              로그인
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
