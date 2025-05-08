import { useState, useCallback } from "react";
import { HookResponse } from "@/types/hook";

/**
 * 메뉴를 삭제하는 커스텀 훅
 * 삭제 상태 관리를 위한 훅 (API는 아직 구현되지 않음)
 *
 * @returns 메뉴 삭제 상태와 함수를 포함하는 객체
 */
export function useDeleteMenu() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  /**
   * 메뉴를 삭제하는 함수
   * 아직 API가 구현되지 않아 성공 응답만 반환합니다.
   *
   * @param menuId 삭제할 메뉴 ID
   * @returns 삭제 결과를 포함하는 프로미스
   */
  const deleteMenu = useCallback(
    async (menuId: number): Promise<HookResponse<boolean>> => {
      // 이전 상태 초기화
      setIsDeleting(true);
      setDeleteSuccess(false);
      setDeleteError(null);

      // menuId 검증
      if (!menuId) {
        const errorMessage = "삭제할 메뉴 ID가 필요합니다.";

        setDeleteError(errorMessage);
        setDeleteSuccess(false);
        setIsDeleting(false);

        return {
          success: false,
          errorMessage,
        };
      }

      try {
        // Todo: API 구현 후 수정 필요
        console.log(`메뉴 ID ${menuId} 삭제 요청 - 백엔드 API 미구현`);

        // API 응답을 시뮬레이션하기 위한 지연
        await new Promise((resolve) => setTimeout(resolve, 500));

        // 성공적으로 처리한 것으로 간주
        setDeleteError(null);
        setDeleteSuccess(true);
        setIsDeleting(false);

        return {
          success: true,
          data: true,
        };

      } catch (error) {
        console.error("메뉴 삭제 오류:", error);

        const errorMessage = "메뉴 삭제 중 오류가 발생했습니다.";
        setDeleteError(errorMessage);
        setDeleteSuccess(false);
        setIsDeleting(false);

        return {
          success: false,
          errorMessage,
        };
      }
    },
    []
  );

  /**
   * 메뉴 삭제 상태 초기화하는 함수
   */
  const resetState = useCallback(() => {
    setDeleteSuccess(false);
    setDeleteError(null);
  }, []);

  return {
    isDeleting,
    deleteSuccess,
    deleteError,
    deleteMenu,
    resetState,
  };
}
