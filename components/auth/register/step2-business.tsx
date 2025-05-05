import { ChangeEvent, useState } from "react";
import { ArrowLeft, ArrowRight, Calendar, Check, Upload } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import StepContainer from "./step-container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { RegisterFormData, Step2Data } from "@/types/register";
import { useBusinessLicenseUpload } from "@/hooks/api/register/useBusinessLicenseUpload";
import { useIdDuplicateCheck } from "@/hooks/api/register/useIdDuplicateCheck";

interface Step2Props {
  onNext: (data: Step2Data) => void;
  onPrev: () => void;
  formData?: Partial<RegisterFormData>;
}

// Zod 스키마 정의
const Step2Schema = z
  .object({
    businessLicenseFile: z.string().min(1, {
      message: "사업자 등록증을 업로드해주세요.",
    }),
    businessRegistrationNo: z.string().regex(/^\d{10}$/, {
      message: "사업자 등록번호는 10자리 숫자여야 합니다.",
    }),
    businessName: z.string().min(2, {
      message: "상호명은 최소 2자 이상이어야 합니다.",
    }),
    ownerName: z.string().min(2, {
      message: "대표자명은 최소 2자 이상이어야 합니다.",
    }),
    phoneNumber: z.string().regex(/^\d{10,11}$/, {
      message: "유효한 전화번호를 입력해주세요.",
    }),
    address: z.string().min(5, {
      message: "주소를 입력해주세요.",
    }),
    businessLaunchingDate: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
        message: "날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)",
      }),
    email: z.string().email({
      message: "유효한 이메일 주소를 입력해주세요.",
    }),
    userId: z.string().regex(/^[a-zA-Z0-9]{4,20}$/, {
      message: "아이디는 영문, 숫자 조합 4-20자여야 합니다.",
    }),
    password: z
      .string()
      .min(8, {
        message: "비밀번호는 최소 8자 이상이어야 합니다.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
          message:
            "비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함해야 합니다.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

/**
 * 사업자 정보 입력 단계 (Step2) 컴포넌트
 */
export default function Step2Business({
  onNext,
  onPrev,
  formData,
}: Step2Props) {
  const [idChecked, setIdChecked] = useState(false);

  // 사업자 등록증 업로드 훅
  const {
    isUploading,
    uploadSuccess,
    uploadError,
    uploadBusinessLicense,
    resetUpload,
  } = useBusinessLicenseUpload();

  // ID 중복 확인 훅
  const { isChecking, checkError, checkIdDuplicate, resetIdCheck } =
    useIdDuplicateCheck();

  // defaultValues 객체를 BusinessFormData 타입에 맞게 변환
  const initialValues: Step2Data = {
    businessLicenseFile: formData?.businessLicenseFile || "",
    businessRegistrationNo: formData?.businessRegistrationNo || "",
    businessName: formData?.businessName || "",
    ownerName: formData?.ownerName || "",
    phoneNumber: formData?.phoneNumber || "",
    address: formData?.address || "",
    businessLaunchingDate: formData?.businessLaunchingDate || "",
    email: formData?.email || "",
    userId: formData?.userId || "",
    password: formData?.password || "",
    confirmPassword: formData?.confirmPassword || "",
  };

  // Todo: 아래 오류 해결
  //  TS2589: Type instantiation is excessively deep and possibly infinite.
  const form = useForm<Step2Data>({
    resolver: zodResolver(Step2Schema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { formState, setError, clearErrors, getValues, setValue } = form;
  const { errors } = formState;

  // 사업자 등록증 업로드 핸들러
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 초기화
    clearErrors("businessLicenseFile");

    // 선택된 파일명 설정
    setValue("businessLicenseFile", file.name);

    // 훅을 사용하여 파일 업로드
    const result = await uploadBusinessLicense(file);

    if (result.success && result.data) {
      // 성공적으로 업로드된 경우, 사업자등록번호 자동 입력 (하이픈 제거)
      setValue(
        "businessRegistrationNo",
        result.data.businessRegistrationNo.replace(/-/g, "")
      );
    } else {
      // 업로드 실패 시 에러 처리
      setError("businessLicenseFile", {
        message: result.errorMessage || "파일 업로드 중 오류가 발생했습니다.",
      });
    }
  };

  // ID 중복 확인
  const handleIdCheck = async () => {
    const userId = getValues("userId");

    if (!userId || userId.length < 4) {
      setError("userId", {
        type: "manual",
        message: "아이디는 영문, 숫자 조합 4-20자여야 합니다.",
      });
      return;
    }

    // 훅을 사용하여 ID 중복 확인
    const result = await checkIdDuplicate(userId);

    // API 응답이 true인 경우 ID 사용 가능
    if (result.success && result.data === true) {
      setIdChecked(true);
      clearErrors("userId");
    } else {
      setError("userId", {
        message: result.errorMessage || "이미 사용 중인 아이디입니다.",
      });
    }
  };

  // 사용자 아이디 변경 시 중복 확인 초기화
  const handleUserIdChange = () => {
    if (idChecked) {
      setIdChecked(false);
      resetIdCheck();
    }
  };

  // 폼 검증 후 다음 단계 진행 핸들러
  const handleSubmit = async () => {
    // ID 중복 확인이 필요한 경우 체크
    if (!idChecked) {
      setError("userId", {
        type: "manual",
        message: "아이디 중복 확인이 필요합니다.",
      });
      return;
    }

    // 폼 유효성 검사
    const result = await form.trigger();
    if (!result) {
      // 첫 번째 에러 필드로 스크롤
      const firstError = Object.keys(errors)[0];
      const errorElement = document.getElementsByName(firstError)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // 현재 폼 데이터를 Step2Data 타입으로 전달
    onNext(getValues());
  };

  // 파일 업로드 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    // 파일 input의 value 초기화 (동일 파일 재업로드를 위함)
    const fileInput = document.getElementById(
      "businessLicenseFile"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    // 이미 업로드된 경우 상태 초기화
    if (uploadSuccess) {
      setValue("businessLicenseFile", "");
      setValue("businessRegistrationNo", "");
      resetUpload();
    }

    // 파일 선택 다이얼로그 열기
    if (fileInput) fileInput.click();
  };

  return (
    <StepContainer>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center mb-2">
          <Upload className="mr-2 h-5 w-5 text-[#FF6B35]" />
          사업자 정보 등록
        </h3>
        <p className="text-gray-500">
          사업자 등록증을 업로드하고 필요한 정보를 입력해주세요.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-2">사업자 정보</h4>
            <p className="text-gray-500">
              사업자 등록증을 업로드하고 기본 정보를 입력해주세요.
            </p>
          </div>

          {/* 사업자 등록증 업로드 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              사업자 등록증
            </label>
            <div className="w-full">
              <input
                id="businessLicenseFile"
                type="file"
                accept="image/*, application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleFileButtonClick}
                fullWidth
                className="h-52 border-dashed flex flex-col items-center justify-center"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#FF6B35] border-t-transparent mb-4"></div>
                    <span className="text-lg">업로드 중...</span>
                  </div>
                ) : uploadSuccess ? (
                  <div className="flex flex-col items-center">
                    <Check className="h-12 w-12 text-green-500 mb-5" />
                    <span className="text-lg font-medium mb-3">
                      {getValues("businessLicenseFile")}
                    </span>
                    <span className="text-base text-green-600">
                      파일이 업로드되었습니다
                    </span>
                    <span className="text-sm text-gray-500 mt-5 underline cursor-pointer">
                      다른 파일 업로드하기
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 mb-6 text-[#FF6B35]" />
                    <span className="text-xl mb-3">사업자 등록증 업로드</span>
                    <span className="text-sm text-gray-500">
                      PDF, JPG, PNG 가능 (최대 3MB)
                    </span>
                  </div>
                )}
              </Button>
            </div>
            {uploadSuccess && (
              <p className="text-green-600 text-sm mt-1">
                사업자 등록증이 업로드되어 사업자등록번호가 자동 입력되었습니다.
              </p>
            )}
            {!uploadSuccess && !uploadError && (
              <p className="text-sm text-gray-500 mt-1">
                사업자 등록증을 업로드하면 사업자등록번호가 자동으로 입력됩니다.
              </p>
            )}
            {uploadError && (
              <p className="text-[#EF4444] text-sm mt-1">{uploadError}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <Input
                label="사업자 등록번호"
                placeholder="0000000000"
                {...form.register("businessRegistrationNo")}
                isError={!!errors.businessRegistrationNo}
                errorMessage={errors.businessRegistrationNo?.message}
                disabled={isUploading}
              />
              <p className="text-sm text-gray-500 mt-1">
                하이픈(-) 없이 10자리 숫자로 입력해주세요.
              </p>
            </div>
            <div>
              <Input
                label="상호명"
                placeholder="가맹점 상호명"
                {...form.register("businessName")}
                isError={!!errors.businessName}
                errorMessage={errors.businessName?.message}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <Input
                label="대표자명"
                placeholder="대표자 이름"
                {...form.register("ownerName")}
                isError={!!errors.ownerName}
                errorMessage={errors.ownerName?.message}
              />
            </div>
            <div>
              <Input
                label="전화번호"
                placeholder="01012345678"
                {...form.register("phoneNumber")}
                isError={!!errors.phoneNumber}
                errorMessage={errors.phoneNumber?.message}
              />
              <p className="text-sm text-gray-500 mt-1">
                하이픈(-) 없이 숫자만 입력해주세요.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <Input
              label="주소"
              placeholder="사업장 주소"
              {...form.register("address")}
              isError={!!errors.address}
              errorMessage={errors.address?.message}
            />
          </div>

          {/* 개업일 정보 */}
          <div className="mb-8">
            <Input
              label="개업일"
              type="date"
              leftIcon={<Calendar className="h-4 w-4 text-gray-500" />}
              placeholder="YYYY-MM-DD"
              {...form.register("businessLaunchingDate")}
              isRequired
              isError={!!errors.businessLaunchingDate}
              errorMessage={errors.businessLaunchingDate?.message}
            />
            <p className="text-sm text-gray-500 mt-1">
              사업자등록증에 기재된 개업일을 입력해주세요.
            </p>
          </div>

          <hr className="my-8 border-t border-gray-200" />

          {/* 계정 정보 입력 필드 */}
          <div>
            <h4 className="text-lg font-bold mb-6">계정 정보</h4>

            {/* 이메일 */}
            <div className="mb-8">
              <Input
                label="이메일"
                placeholder="your@email.com"
                {...form.register("email")}
                isError={!!errors.email}
                errorMessage={errors.email?.message}
              />
            </div>

            <div className="mb-8">
              <div className="flex gap-2 items-center">
                <div className="flex-grow">
                  <Input
                    label="아이디"
                    placeholder="사용할 아이디"
                    {...form.register("userId", {
                      onChange: handleUserIdChange,
                    })}
                    isError={!!errors.userId || !!checkError}
                    errorMessage={checkError || errors.userId?.message}
                    disabled={idChecked}
                  />
                </div>
                <div className="mt-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleIdCheck}
                    disabled={idChecked || isChecking}
                    className="h-10 px-4 whitespace-nowrap"
                  >
                    {idChecked
                      ? "사용 가능"
                      : isChecking
                      ? "확인 중..."
                      : "중복 확인"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                영문, 숫자 조합 4-20자
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <Input
                  type="password"
                  label="비밀번호"
                  placeholder="********"
                  {...form.register("password")}
                  isError={!!errors.password}
                  errorMessage={errors.password?.message}
                />
                <p className="text-sm text-gray-500 mt-1">
                  대문자, 소문자, 숫자, 특수문자를 포함한 8자 이상
                </p>
              </div>
              <div>
                <Input
                  type="password"
                  label="비밀번호 확인"
                  placeholder="********"
                  {...form.register("confirmPassword")}
                  isError={!!errors.confirmPassword}
                  errorMessage={errors.confirmPassword?.message}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onPrev}
            className="border-2 py-6 px-8"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            이전
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            className="py-6 px-8"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            다음
          </Button>
        </div>
      </div>
    </StepContainer>
  );
}
