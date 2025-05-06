import { useState } from "react";
import { HookResponse } from "@/types/hook";
import { MerchantInfoResponse } from "@/app/api/merchant/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 가맹점 정보를 조회하는 커스텀 훅
 *
 * @returns 가맹점 정보 상태와 관련 함수들을 포함하는 객체
 */
export function useMerchantInfo() {
  const [merchantInfo, setMerchantInfo] = useState<MerchantInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 가맹점 정보를 조회하는 함수
   *
   * @returns 가맹점 정보 조회 결과를 포함하는 프로미스
   */
  const fetchMerchantInfo = async (): Promise<HookResponse<MerchantInfoResponse>> => {
    // 이전 상태 초기화
    setIsLoading(true);
    setError(null);

    try {
      // API 호출 (가맹점 정보 조회)
      const response = await fetch("/api/merchant");

      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        const errorMessage = errorResponse.errorMessage || "가맹점 정보 조회에 실패했습니다.";

        setError(errorMessage);
        setIsLoading(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<MerchantInfoResponse> = await response.json();

      // 가맹점 정보가 없는 경우
      if (data.data == null) {
        const errorMessage = "가맹점 정보를 받아올 수 없습니다.";

        setError(errorMessage);
        setIsLoading(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 성공적으로 데이터를 받아온 경우
      setMerchantInfo(data.data);
      setError(null);
      setIsLoading(false);

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("가맹점 정보 조회 오류:", error);

      const errorMessage = "가맹점 정보 조회 중 오류가 발생했습니다.";
      setError(errorMessage);
      setIsLoading(false);

      return {
        success: false,
        errorMessage,
      };
    }
  };

  return {
    merchantInfo,
    isLoading: isLoading,
    error,
    fetchMerchantInfo,
  };
}
