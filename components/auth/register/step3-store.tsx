import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Check, Upload, Clock } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import { Dropdown } from "@/components/ui/Dropdown";
import { DropdownMenuItem } from "@/components/ui/DropdownMenuItem";
import { RegisterFormData, BusinessDay, Step3Data } from "@/types/register";
import StepContainer from "./step-container";
import { useMerchantImageUpload } from "@/hooks/useMerchantImageUpload";
import { BUSINESS_DAYS, getDefaultBusinessDays } from "@/constants/business-hours";

interface Step3Props {
  onNext: (data: Step3Data) => void;
  onPrev: () => void;
  defaultValues?: Partial<RegisterFormData>;
}

// Zod 스키마 정의
const Step3Schema = z.object({
  storeImage: z.string().optional(),
  storeImageUrl: z.string().optional(),
  storeDescription: z.string().min(10, {
    message: "매장 소개는 최소 10자 이상 입력해주세요.",
  }),
  businessDays: z.array(
    z.object({
      day: z.string(),
      isOpen: z.boolean(),
      openTime: z.string(),
      closeTime: z.string(),
    })
  ),
});

/**
 * 매장 정보 단계 (Step3) 컴포넌트
 */
export default function Step3Store({
  onNext,
  onPrev,
  defaultValues,
}: Step3Props) {
  // 외부 파일에서 불러온 상수들을 사용
  const businessDaysDefault = getDefaultBusinessDays();

  // businessDays 상태를 컴포넌트 레벨에서 관리
  const [businessDays, setBusinessDays] = useState<BusinessDay[]>(
    defaultValues?.businessDays || businessDaysDefault
  );

  // 이미지 업로드 훅 사용
  const {
    isUploading,
    uploadSuccess,
    uploadError,
    uploadMerchantImage,
    resetUpload,
  } = useMerchantImageUpload();

  // Todo: 아래 오류 해결
  //  TS2589: Type instantiation is excessively deep and possibly infinite.
  const form = useForm<Step3Data>({
    resolver: zodResolver(Step3Schema),
    defaultValues: {
      storeImage: defaultValues?.storeImage || "",
      storeImageUrl: defaultValues?.storeImageUrl || "",
      storeDescription: defaultValues?.storeDescription || "",
      businessDays: defaultValues?.businessDays || businessDaysDefault,
    },
    mode: "onChange",
  });

  const { formState, getValues, setValue, register, trigger } = form;
  const { errors } = formState;

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 선택된 파일명 설정
    setValue("storeImage", file.name);

    // 업로드 API 호출
    const result = await uploadMerchantImage(file);

    if (result.success && result.data) {
      // 성공적으로 업로드된 경우, 이미지 URL 저장
      setValue("storeImageUrl", result.data.imageUrl);
    } else {
      // 업로드 실패 시 에러 처리
      form.setError("storeImage", {
        type: "manual",
        message: result.errorMessage || "이미지 업로드 중 오류가 발생했습니다.",
      });
    }
  };

  // 파일 업로드 버튼 클릭 핸들러
  const handleFileButtonClick = () => {
    // 파일 input의 value 초기화 (동일 파일 재업로드를 위함)
    const fileInput = document.getElementById("storeImage") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }

    // 이미 업로드된 경우 상태 초기화
    if (uploadSuccess) {
      setValue("storeImage", "");
      setValue("storeImageUrl", "");
      resetUpload();
    }

    // 파일 선택 다이얼로그 열기
    if (fileInput) fileInput.click();
  };

  // 영업여부 변경 핸들러
  const handleOpenChange = (index: number, checked: boolean) => {
    const updatedDays = [...businessDays];
    updatedDays[index].isOpen = checked;
    setBusinessDays(updatedDays);
    setValue("businessDays", updatedDays);
  };

  // 영업시간 변경 핸들러
  const handleTimeChange = (
    index: number,
    timeType: "openTime" | "closeTime",
    value: string
  ) => {
    const updatedDays = [...businessDays];
    updatedDays[index][timeType] = value;
    setBusinessDays(updatedDays);
    setValue("businessDays", updatedDays);
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

    // 현재 폼 데이터를 Step3Data 타입으로 전달
    const formData = getValues();
    onNext({
      storeImage: formData.storeImage || "",
      storeImageUrl: formData.storeImageUrl || "",
      storeDescription: formData.storeDescription,
      businessDays: formData.businessDays,
    } as Step3Data);
  };

  // 시간 옵션 생성
  const generateTimeOptions = () => {
    return Array.from({ length: 24 }).map((_, hour) => {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      return (
        <DropdownMenuItem key={timeString} value={timeString}>
          {timeString}
        </DropdownMenuItem>
      );
    });
  };

  return (
    <StepContainer>
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center mb-2">
          <Clock className="mr-2 h-5 w-5 text-[#FF6B35]" />
          매장 정보 설정
        </h3>
        <p className="text-gray-500">
          고객에게 보여질 매장 정보와 영업 시간을 설정하세요.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          {/* 매장 이미지 업로드 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              매장 대표 이미지
            </label>
            <div className="w-full">
              <input
                id="storeImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
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
                      {getValues("storeImage")}
                    </span>
                    <span className="text-base text-green-600">
                      파일이 업로드되었습니다
                    </span>
                    <span className="text-sm text-gray-500 mt-5 underline cursor-pointer">
                      다른 이미지 업로드하기
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-12 w-12 mb-6 text-[#FF6B35]" />
                    <span className="text-xl mb-3">
                      매장 대표 이미지 업로드
                    </span>
                    <span className="text-sm text-gray-500">
                      JPG, PNG 가능 (최대 5MB)
                    </span>
                  </div>
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              고객에게 노출되는 대표 이미지입니다. 매장 전경, 내부 인테리어,
              대표 메뉴 등을 활용하세요.
            </p>
            {uploadError && (
              <p className="text-[#EF4444] text-sm mt-1">{uploadError}</p>
            )}
          </div>

          {/* 매장 소개 */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              매장 소개
            </label>
            <div>
              <textarea
                {...register("storeDescription")}
                placeholder="매장에 대한 소개, 인기 메뉴, 특별한 점 등을 작성해주세요."
                className={`w-full px-4 py-2 border ${
                  errors.storeDescription
                    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]"
                    : "border-[#D2D9E0] focus:border-[#FF6B35] focus:ring-[#FF6B35]"
                } rounded-lg shadow-sm min-h-[150px] focus:outline-none focus:ring-1`}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              매장의 특징, 분위기, 역사 등을 자세히 설명해주세요.
            </p>
            {errors.storeDescription && (
              <p className="text-[#EF4444] text-sm mt-1">
                {errors.storeDescription.message}
              </p>
            )}
          </div>

          {/* 영업 시간 */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              영업 시간
            </label>
            <div className="bg-white border rounded-md p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="font-medium text-sm">요일</div>
                <div className="font-medium text-sm">영업여부</div>
                <div className="font-medium text-sm">오픈 시간</div>
                <div className="font-medium text-sm">마감 시간</div>

                {BUSINESS_DAYS.map((day, index) => (
                  <React.Fragment key={day}>
                    <div className="flex items-center text-sm">{day}</div>
                    <div>
                      <Switch
                        checked={businessDays[index].isOpen}
                        onCheckedChange={(checked) =>
                          handleOpenChange(index, checked)
                        }
                      />
                    </div>
                    <div>
                      <Dropdown
                        value={businessDays[index].openTime}
                        onChange={(value) =>
                          handleTimeChange(index, "openTime", value)
                        }
                        disabled={!businessDays[index].isOpen}
                      >
                        {generateTimeOptions()}
                      </Dropdown>
                    </div>
                    <div>
                      <Dropdown
                        value={businessDays[index].closeTime}
                        onChange={(value) =>
                          handleTimeChange(index, "closeTime", value)
                        }
                        disabled={!businessDays[index].isOpen}
                      >
                        {generateTimeOptions()}
                      </Dropdown>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
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
            다음
          </Button>
        </div>
      </div>
    </StepContainer>
  );
}
