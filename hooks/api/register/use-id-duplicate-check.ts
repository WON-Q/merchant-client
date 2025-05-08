import { useState } from "react";
import { HookResponse } from "@/types/hook";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 사용자 ID 중복 확인을 처리하는 커스텀 훅
 *
 * @returns ID 중복 확인을 위한 상태와 핸들러를 포함하는 객체
 */
export function useIdDuplicateCheck() {
  const [isChecking, setIsChecking] = useState(false);
  const [checkSuccess, setCheckSuccess] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  /**
   * 사용자 ID가 이미 사용 중인지 확인하는 함수
   *
   * @param userId 확인할 사용자 ID
   * @returns 결과 객체를 포함한 프로미스
   */
  const checkIdDuplicate = async (
    userId: string
  ): Promise<HookResponse<boolean>> => {
    // 이전 상태 초기화
    setIsChecking(true);
    setCheckSuccess(false);
    setCheckError(null);

    // 사용자 ID 형식 검증
    if (!userId || userId.length < 4 || !/^[a-zA-Z0-9]{4,20}$/.test(userId)) {
      const errorMessage = "아이디는 영문, 숫자 조합 4-20자여야 합니다.";

      setCheckError(errorMessage);
      setCheckSuccess(false);
      setIsChecking(false);

      return {
        success: false,
        errorMessage,
      };
    }

    try {
      // API 호출 (ID 중복 확인)
      const response = await fetch(
        `/api/auth/signup/check-id?accountId=${userId}`
      );

      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        const errorMessage = errorResponse.errorMessage || "중복 아이디 확인 중 오류가 발생했습니다.";

        setCheckError(errorMessage);
        setCheckSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<boolean> = await response.json();

      // 아이디 중복 확인 결과가 없는 경우
      if (data.data === undefined || data.data === null) {
        const errorMessage = "아이디 중복 확인 결과가 없습니다.";

        setCheckError(errorMessage);
        setCheckSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 이미 사용 중인 아이디인 경우
      if (!data.data) {
        const errorMessage = "이미 사용 중인 아이디입니다.";

        setCheckError(errorMessage);
        setCheckSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 사용 가능한 아이디인 경우
      setCheckError(null);
      setCheckSuccess(true);

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("아이디 확인 오류:", error);

      const errorMessage = "아이디 확인 중 오류가 발생했습니다.";
      setCheckError(errorMessage);
      setCheckSuccess(false);

      return {
        success: false,
        errorMessage,
      };
    } finally {
      setIsChecking(false);
    }
  };

  /**
   * ID 확인 상태 초기화하는 함수
   */
  const resetIdCheck = () => {
    setCheckSuccess(false);
    setCheckError(null);
  };

  return {
    isChecking,
    checkSuccess,
    checkError,
    checkIdDuplicate,
    resetIdCheck,
  };
}
