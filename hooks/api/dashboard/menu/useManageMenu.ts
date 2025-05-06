import { useState } from "react";
import { useCreateMenu } from "./useCreateMenu";
import { useDeleteMenu } from "./useDeleteMenu";
import { useDuplicateMenu } from "./useDuplicateMenu";
import { useUpdateMenuAvailability } from "./useUpdateMenuAvailability";
import {
  GetMenuResponseDto,
  CreateMenuRequestDto,
} from "@/app/api/dashboard/menu/route";
import { HookResponse } from "@/types/hook";

/**
 * 메뉴 관리 기능을 통합적으로 제공하는 커스텀 훅
 * 여러 메뉴 관련 훅을 통합하여 일관된 인터페이스를 제공합니다.
 *
 * @returns 메뉴 관리에 필요한 모든 상태와 함수를 포함하는 객체
 */
export function useManageMenu() {
  // 각 기능별 훅 사용
  const {
    isCreating,
    createSuccess,
    error: createError,
    createMenu,
    resetState: resetCreateState,
  } = useCreateMenu();

  const {
    isDuplicating,
    duplicateSuccess,
    duplicateError,
    duplicateMenu,
    resetState: resetDuplicateState,
  } = useDuplicateMenu();

  const {
    isDeleting,
    deleteSuccess,
    deleteError,
    deleteMenu,
    resetState: resetDeleteState,
  } = useDeleteMenu();

  const {
    isUpdating,
    updateSuccess,
    updateError,
    toggleAvailability,
    resetState: resetUpdateState,
  } = useUpdateMenuAvailability();

  // 통합 에러 상태
  const [error, setError] = useState<string | null>(null);

  // 에러 상태 통합
  const currentError = createError || duplicateError || deleteError || updateError || error;

  /**
   * 메뉴 생성 함수
   *
   * @param menuData 생성할 메뉴 데이터
   * @returns 메뉴 생성 결과
   */
  const handleCreateMenu = async (
    menuData: CreateMenuRequestDto
  ): Promise<HookResponse<GetMenuResponseDto>> => {
    resetAllStates();
    const result = await createMenu(menuData);

    if (!result.success) {
      setError(result.errorMessage || "메뉴 생성에 실패했습니다.");
      return {
        success: false,
        errorMessage: result.errorMessage,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  };

  /**
   * 메뉴 복제 함수
   *
   * @param menuId 복제할 메뉴 ID
   * @param menus 현재 메뉴 목록
   * @returns 메뉴 복제 결과
   */
  const handleDuplicateMenu = async (
    menuId: number,
    menus: GetMenuResponseDto[]
  ): Promise<HookResponse<GetMenuResponseDto>> => {
    resetAllStates();

    // menus 배열이 없거나 비어있는 경우 처리
    if (!menus || menus.length === 0) {
      const errorMessage = "메뉴 목록이 없어 복제할 수 없습니다.";
      setError(errorMessage);

      return {
        success: false,
        errorMessage,
      };
    }

    // 수정된 duplicateMenu 호출 - 메뉴 ID와 메뉴 목록 전달
    const result = await duplicateMenu(menuId, menus);

    if (!result.success) {
      setError(result.errorMessage || "메뉴 복제에 실패했습니다.");
      return result;
    }

    return result;
  };

  /**
   * 메뉴 삭제 함수
   *
   * @param menuId 삭제할 메뉴 ID
   * @returns 메뉴 삭제 결과
   */
  const handleDeleteMenu = async (
    menuId: number
  ): Promise<HookResponse<boolean>> => {
    resetAllStates();
    const result = await deleteMenu(menuId);

    if (!result.success) {
      setError(result.errorMessage || "메뉴 삭제에 실패했습니다.");
      return result;
    }

    return result;
  };

  /**
   * 메뉴 판매 상태 변경 함수
   *
   * @param menuId 상태를 변경할 메뉴 ID
   * @param isAvailable 변경할 판매 상태
   * @returns 상태 변경 결과
   */
  const handleToggleAvailability = async (
    menuId: number,
    isAvailable: boolean
  ) => {
    resetAllStates();
    const result = await toggleAvailability(menuId, isAvailable);

    if (!result.success) {
      setError(result.errorMessage || "메뉴 상태 변경에 실패했습니다.");
      return result;
    }

    return result;
  };

  /**
   * 모든 상태를 초기화하는 함수
   */
  const resetAllStates = () => {
    resetCreateState();
    resetDuplicateState();
    resetDeleteState();
    resetUpdateState();
    setError(null);
  };

  return {
    // 상태
    isCreating,
    isDuplicating,
    isDeleting,
    isUpdating,
    createSuccess,
    duplicateSuccess,
    deleteSuccess,
    updateSuccess,
    error: currentError,

    // 액션
    createMenu: handleCreateMenu,
    duplicateMenu: handleDuplicateMenu,
    deleteMenu: handleDeleteMenu,
    toggleAvailability: handleToggleAvailability,
    resetState: resetAllStates,
  };
}
