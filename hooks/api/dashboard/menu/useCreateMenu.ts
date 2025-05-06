import { useState } from "react";
import { HookResponse } from "@/types/hook";
import {
  CreateMenuRequestDto,
  CreateMenuResponseDto,
} from "@/app/api/dashboard/menu/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 메뉴를 생성하는 커스텀 훅
 *
 * @returns 메뉴 생성 상태와 함수를 포함하는 객체
 */
export function useCreateMenu() {
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * 메뉴를 생성하는 함수
   *
   * @param menuData 메뉴 생성 요청 데이터
   * @returns 메뉴 생성 결과를 포함하는 프로미스
   */
  const createMenu = async (
    menuData: CreateMenuRequestDto
  ): Promise<HookResponse<CreateMenuResponseDto>> => {
    // 이전 상태 초기화
    setIsCreating(true);
    setCreateSuccess(false);
    setError(null);

    try {
      // API 호출 (메뉴 생성)
      const response = await fetch("/api/dashboard/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menuData),
      });

      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        const errorMessage = errorResponse.errorMessage || "메뉴 생성에 실패했습니다.";

        setError(errorMessage);
        setCreateSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<CreateMenuResponseDto> = await response.json();

      // 메뉴 생성 결과 데이터가 없는 경우
      if (data.data == null) {
        const errorMessage = "메뉴 생성 정보를 받아올 수 없습니다.";

        setError(errorMessage);
        setCreateSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 성공적으로 데이터를 받아온 경우
      setError(null);
      setCreateSuccess(true);

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("메뉴 생성 오류:", error);

      const errorMessage = "메뉴 생성 중 오류가 발생했습니다.";
      setError(errorMessage);
      setCreateSuccess(false);

      return {
        success: false,
        errorMessage,
      };

    } finally {
      setIsCreating(false);
    }
  };

  /**
   * 메뉴 생성 상태 초기화하는 함수
   */
  const resetState = () => {
    setCreateSuccess(false);
    setError(null);
  };

  return {
    isCreating,
    createSuccess,
    error,
    createMenu,
    resetState,
  };
}
