import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu-item";
import { RegisterFormData, Step4Data } from "@/types/register";
import StepContainer from "./step-container";
import { KOREAN_BANKS } from "@/constants/banks";
import { useSignup } from "@/hooks/api/register/use-signup";

interface Step4Props {
  onNext: (data: Step4Data) => void;
  onPrev: () => void;
  formData?: Partial<RegisterFormData>;
}

// Zod 스키마 정의
const Step4Schema = z.object({
  bankName: z.string().min(1, {
    message: "은행을 선택해주세요.",
  }),
  accountNumber: z.string().min(1, {
    message: "계좌번호를 입력해주세요.",
  }),
  accountHolderName: z.string().min(1, {
    message: "예금주명을 입력해주세요.",
  }),
});

/**
 * 계좌 정보 단계 (Step4) 컴포넌트
 */
export default function Step4Account({ onNext, onPrev, formData }: Step4Props) {
  // 회원가입 훅
  const { submitSignup, isSubmitting, signupError } = useSignup();

  // defaultValues 객체를 Step4Data 타입에 맞게 변환
  const initialValues: Step4Data = {
    bankName: formData?.bankName || "",
    accountNumber: formData?.accountNumber || "",
    accountHolderName: formData?.accountHolderName || "",
  };

  // Todo: 아래 오류 해결
  //  TS2589: Type instantiation is excessively deep and possibly infinite.
  const form = useForm<Step4Data>({
    resolver: zodResolver(Step4Schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { formState, getValues, setValue, watch, trigger } = form;
  const { errors } = formState;

  const handleBankNameChange = (value: string) => {
    setValue("bankName", value);
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    // 폼 유효성 검사
    const result = await trigger();
    if (!result) {
      // 첫 번째 에러 필드로 스크롤
      const firstError = Object.keys(errors)[0];
      const errorElement = document.getElementsByName(firstError)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // 현재 폼 데이터 가져오기
    const currentFormData = getValues();

    // 회원가입 처리를 위한 전체 폼 데이터 구성
    const completeFormData = {
      ...formData,
      ...currentFormData,
    } as RegisterFormData;

    // 회원가입 API 호출
    const signupResult = await submitSignup(completeFormData);

    if (signupResult.success) {
      // 성공 시 다음 단계로
      onNext(currentFormData);
    }
  };

  return (
    <StepContainer>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center mb-2">
          <CreditCard className="mr-2 h-5 w-5 text-[#FF6B35]" />
          계좌 정보 등록
        </h3>
        <p className="text-gray-500">정산을 위한 계좌 정보를 입력해주세요.</p>
        
      </div>
          <p className="text-m text-gray-500 mt-6">
          ※ 일일 정산은 <span className="font-medium text-[#FF6B35]">02:00</span> 에 진행됩니다.
        </p>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-2">대표 계좌 정보</h4>
            <p className="text-gray-500">
              매출 정산을 위한 계좌 정보를 입력해주세요.
            </p>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              은행명 <span className="text-[#EF4444]">*</span>
            </label>
            <Dropdown
              value={watch("bankName")}
              onChange={handleBankNameChange}
              placeholder="은행을 선택하세요"
              isError={!!errors.bankName}
              errorMessage={errors.bankName?.message}
            >
              {KOREAN_BANKS.map((bank) => (
                <DropdownMenuItem key={bank.value} value={bank.value}>
                  {bank.label}
                </DropdownMenuItem>
              ))}
            </Dropdown>
          </div>

          <div className="mb-8">
            <Input
              label="계좌번호"
              placeholder="'-' 없이 숫자만 입력해주세요"
              {...form.register("accountNumber")}
              isRequired
              isError={!!errors.accountNumber}
              errorMessage={errors.accountNumber?.message}
            />
          </div>

          <div className="mb-8">
            <Input
              label="예금주명"
              placeholder="예금주명을 입력해주세요"
              {...form.register("accountHolderName")}
              isRequired
              isError={!!errors.accountHolderName}
              errorMessage={errors.accountHolderName?.message}
            />
            <p className="text-sm text-gray-500 mt-1">
              사업자등록증상 대표자명과 동일해야 합니다.
            </p>
          </div>
        </div>

        {/* 에러 메시지 표시 */}
        {signupError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            <p className="font-medium">회원가입 중 오류가 발생했습니다</p>
            <p>{signupError}</p>
          </div>
        )}
        

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={onPrev}
            leftIcon={<ArrowLeft className="h-5 w-5" />}
            disabled={isSubmitting}
          >
            이전
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={handleSubmit}
            rightIcon={<ArrowRight className="h-5 w-5" />}
            isLoading={isSubmitting}
            loadingText="가입 처리중..."
          >
            완료
          </Button>
        </div>
      </div>
    </StepContainer>
  );
}
