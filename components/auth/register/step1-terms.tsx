import { ArrowLeft, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import StepContainer from "./step-container";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RegisterFormData, Step1Data } from "@/types/register";

interface Step1Props {
  onNext: (data: Step1Data) => void;
  onPrev: () => void;
  formData?: Partial<RegisterFormData>;
}

/**
 * 약관 동의 단계 (Step1) 컴포넌트
 */
export default function Step1Terms({
  onNext,
  onPrev,
  formData,
}: Step1Props) {
  // 약관 동의 상태 관리
  const [agreements, setAgreements] = useState({
    allAgreed: formData?.allAgreed || false,
    serviceTerms: formData?.serviceTerms || false,
    privacyTerms: formData?.privacyTerms || false,
    marketingTerms: formData?.marketingTerms || false,
  });

  // 폼 제출 시도 여부 (에러 표시 용도)
  const [formSubmitted, setFormSubmitted] = useState(false);

  // 약관 동의 상태 변경 시 allAgreed 상태 업데이트
  useEffect(() => {
  const { serviceTerms, privacyTerms, marketingTerms } = agreements;

  const allChecked = serviceTerms && privacyTerms && marketingTerms;

  setAgreements((prev) => {
    if (prev.allAgreed !== allChecked) {
      return { ...prev, allAgreed: allChecked };
    }
    return prev; // 변화 없으면 그대로 반환 (렌더링 막음)
  });
}, [
  agreements.serviceTerms,
  agreements.privacyTerms,
  agreements.marketingTerms,
]);


  // 모든 약관 동의 처리
  const handleAllAgree = (checked: boolean) => {
    setAgreements({
      allAgreed: checked,
      serviceTerms: checked,
      privacyTerms: checked,
      marketingTerms: checked,
    });
  };

  // 개별 약관 동의 처리
  const handleAgreementChange = (
    key: keyof typeof agreements,
    checked: boolean
  ) => {
    setAgreements((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  // 다음 단계로 진행
  const handleSubmit = () => {
    setFormSubmitted(true);

    // 필수 약관 동의 여부 확인
    if (!agreements.serviceTerms || !agreements.privacyTerms) {
      return;
    }

    onNext({
      allAgreed: agreements.allAgreed,
      serviceTerms: agreements.serviceTerms,
      privacyTerms: agreements.privacyTerms,
      marketingTerms: agreements.marketingTerms,
    } as Step1Data);
  };

  // 필수 약관에 대한 에러 메시지 표시 여부
  const showServiceTermsError = formSubmitted && !agreements.serviceTerms;
  const showPrivacyTermsError = formSubmitted && !agreements.privacyTerms;

  return (
    <div className="space-y-8">
      <StepContainer>
        <div className="mb-6">
          <h3 className="text-xl font-bold flex items-center mb-2">
            <Shield className="mr-2 h-5 w-5 text-[#FF6B35]" />
            약관 동의
          </h3>
          <p className="text-gray-500">
            서비스 이용을 위한 약관에 동의해주세요.
          </p>
        </div>

        <div className="space-y-8">
          {/* 전체 동의 */}
          <div className="rounded-xl overflow-hidden border">
            <div className="bg-[#FF6B35]/5 p-5 flex items-center space-x-4">
              <Checkbox
                checked={agreements.allAgreed}
                onCheckedChange={(checked) =>
                  handleAllAgree(checked as boolean)
                }
                size="lg"
              />
              <div className="space-y-1 leading-none">
                <label className="text-lg font-bold">
                  모든 약관에 동의합니다
                </label>
                <p className="text-sm text-gray-500">
                  필수 약관 및 선택 약관에 모두 동의합니다
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 border-t pt-5">
            {/* 서비스 이용약관 */}
            <div className="flex flex-row items-start space-x-4">
              <div className="mt-1">
                <Checkbox
                  checked={agreements.serviceTerms}
                  onCheckedChange={(checked) =>
                    handleAgreementChange("serviceTerms", checked as boolean)
                  }
                  size="md"
                />
              </div>
              <div className="space-y-1 leading-none">
                <div className="flex items-center">
                  <label className="text-base mr-1 font-medium">
                    서비스 이용약관에 동의합니다
                  </label>
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    필수
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  <Link
                    href="/terms/services"
                    className="text-[#FF6B35] hover:underline"
                    target="_blank"
                  >
                    약관 보기 →
                  </Link>
                </p>
                {showServiceTermsError && (
                  <p className="text-xs text-red-500 mt-1">
                    서비스 이용약관에 동의해야 합니다.
                  </p>
                )}
              </div>
            </div>

            {/* 개인정보 처리방침 */}
            <div className="flex flex-row items-start space-x-4">
              <div className="mt-1">
                <Checkbox
                  checked={agreements.privacyTerms}
                  onCheckedChange={(checked) =>
                    handleAgreementChange("privacyTerms", checked as boolean)
                  }
                  size="md"
                />
              </div>
              <div className="space-y-1 leading-none">
                <div className="flex items-center">
                  <label className="text-base mr-1 font-medium">
                    개인정보 처리방침에 동의합니다
                  </label>
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    필수
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  <Link
                    href="/terms/privacy"
                    className="text-[#FF6B35] hover:underline"
                    target="_blank"
                  >
                    약관 보기 →
                  </Link>
                </p>
                {showPrivacyTermsError && (
                  <p className="text-xs text-red-500 mt-1">
                    개인정보 처리방침에 동의해야 합니다.
                  </p>
                )}
              </div>
            </div>

            {/* 마케팅 정보 수신 */}
            <div className="flex flex-row items-start space-x-4">
              <div className="mt-1">
                <Checkbox
                  checked={agreements.marketingTerms}
                  onCheckedChange={(checked) =>
                    handleAgreementChange("marketingTerms", checked as boolean)
                  }
                  size="md"
                />
              </div>
              <div className="space-y-1 leading-none">
                <div className="flex items-center">
                  <label className="text-base mr-1 font-medium">
                    마케팅 정보 수신에 동의합니다
                  </label>
                  <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-medium">
                    선택
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  <Link
                    href="/terms/marketing"
                    className="text-[#FF6B35] hover:underline"
                    target="_blank"
                  >
                    약관 보기 →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <Button
            variant="outline"
            size="lg"
            onClick={onPrev}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
          >
            이전
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            다음 단계로
          </Button>
        </div>
      </StepContainer>

      <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex items-start gap-3">
        <CheckCircle2 className="h-8 w-8 text-blue-500 shrink-0 mt-1" />
        <div className="text-blue-800">
          <h4 className="font-medium">안전한 정보 보호</h4>
          <p className="text-sm mt-1">
            입력하신 모든 정보는 안전하게 암호화되어 저장되며, 본인 확인 및
            서비스 제공 목적으로만 사용됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
