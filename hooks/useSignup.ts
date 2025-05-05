import { useState } from "react";
import { RegisterFormData } from "@/types/register";
import {
  SignupRequestDto,
  SignupResponseDto,
} from "@/app/api/auth/signup/route";
import { useSignupDataTransform } from "./useSignupDataTransform";
import { HookResponse } from "@/types/hook";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 회원가입 요청을 처리하는 커스텀 훅
 *
 * @returns 회원가입 요청 상태와 함수를 포함하는 객체
 */
export function useSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const { transformToSignupDTO } = useSignupDataTransform();

  /**
   * 회원가입 요청을 처리하는 함수
   *
   * @param formData 회원가입 폼 데이터
   * @returns 회원가입 결과를 포함하는 프로미스
   */
  const submitSignup = async (
    formData: RegisterFormData
  ): Promise<HookResponse<SignupResponseDto>> => {
    // 이전 상태 초기화
    setIsSubmitting(true);
    setSignupSuccess(false);
    setSignupError(null);

    try {
      // 폼 데이터를 회원가입 API DTO로 변환
      const signupDTO: SignupRequestDto = transformToSignupDTO(formData);

      // API 호출 (회원가입)
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupDTO),
      });

      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        const errorMessage = errorResponse.errorMessage || "회원가입 처리 중 오류가 발생했습니다.";

        setSignupError(errorMessage);
        setSignupSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<SignupResponseDto> = await response.json();

      // 회원가입 정보가 없는 경우
      if (data.data == null) {
        const errorMessage = "회원가입 정보를 받아올 수 없습니다.";

        setSignupError(errorMessage);
        setSignupSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 성공적으로 처리된 경우
      setSignupError(null);
      setSignupSuccess(true);

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("회원가입 오류:", error);

      const errorMessage = "회원가입 중 오류가 발생했습니다.";
      setSignupError(errorMessage);
      setSignupSuccess(false);

      return {
        success: false,
        errorMessage,
      };

    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 회원가입 상태 초기화 함수
   */
  const resetSignup = () => {
    setSignupSuccess(false);
    setSignupError(null);
  };

  return {
    submitSignup,
    isSubmitting,
    signupSuccess,
    signupError,
    resetSignup,
  };
}
