"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuList } from "@/components/dashboard/menu/menu-list";
import { MenuTabs } from "@/components/dashboard/menu/menu-tabs";
import { useGetMenuList } from "@/hooks/api/dashboard/menu/use-get-menu-list";
import { useManageMenu } from "@/hooks/api/dashboard/menu/use-manage-menu";
import { useMerchantContext } from "@/contexts/merchant-context";
import {
  CreateMenuRequestDto,
  GetMenuResponseDto,
} from "@/app/api/dashboard/menu/route";
import { extractMenuCategories } from "@/lib/utils";
import CreateNewMenuModal from "@/components/dashboard/menu/modal/create-new-menu-modal";

/**
 * 메뉴 관리 페이지 컴포넌트
 */
export default function MenuPage() {
  // 가맹점 ID 가져오기
  const { merchantInfo } = useMerchantContext();
  const merchantId = merchantInfo?.merchantId;

  // API 훅 초기화 - 통합된 API 요청 및 상태 관리
  const { menus, isLoadingMenus, menuError, fetchMenuList } = useGetMenuList();

  const {
    isCreating,
    isUpdating,
    isDeleting,
    isDuplicating,
    error: manageError,
    toggleAvailability,
    duplicateMenu,
    deleteMenu,
    createMenu,
  } = useManageMenu();

  // 상태 관리
  const [activeTab, setActiveTab] = useState("all");
  const [menuItems, setMenuItems] = useState<GetMenuResponseDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 통합된 로딩 상태
  const isLoading = isUpdating || isDeleting || isDuplicating || isCreating;

  // 마운트 시 메뉴 목록 조회
  useEffect(() => {
    if (merchantId) {
      void fetchMenuList(merchantId); // void 연산자 추가로 Promise 무시 의도 명시
    }
  }, [merchantId, fetchMenuList]);

  // 메뉴 목록 데이터 업데이트
  useEffect(() => {
    if (menus) {
      setMenuItems([...menus]);
    }
  }, [menus]);

  // 카테고리 추출
  const categories = extractMenuCategories(menuItems);

  /**
   * 메뉴 품절 상태 토글 핸들러
   */
  const handleToggleAvailability = async (id: number, isAvailable: boolean) => {
    try {
      const result = await toggleAvailability(id, isAvailable);

      if (result.success) {
        // 로컬 상태 업데이트 - 메뉴 목록에서 해당 메뉴의 상태 변경
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item.menuId === id ? { ...item, isAvailable } : item
          )
        );
      }
    } catch (error) {
      console.error("품절 상태 변경 중 오류:", error);
    }
  };

  /**
   * 메뉴 복제 핸들러
   */
  const handleDuplicateMenu = async (id: number) => {
    try {
      console.log("[디버깅] 복제 요청 메뉴 ID:", id);
      console.log("[디버깅] 복제에 사용할 메뉴 목록:", menuItems);

      // 메뉴 ID와 현재 메뉴 목록 모두 전달
      const result = await duplicateMenu(id, menuItems);

      if (result.success && result.data) {
        // 로컬 상태 업데이트 - 복제된 메뉴 추가
        setMenuItems((prevItems) => [
          ...prevItems,
          result.data as GetMenuResponseDto,
        ]);
      }
    } catch (error) {
      console.error("메뉴 복제 중 오류:", error);
    }
  };

  /**
   * MenuItemCard 컴포넌트에 전달할 복제 핸들러
   * MenuItemCard는 id만 전달받기 때문에 내부적으로 menuItems를 참조하는 래퍼 함수 제공
   */
  const handleItemCardDuplicate = async (id: number) => {
    await handleDuplicateMenu(id);
  };

  /**
   * 메뉴 삭제 핸들러
   */
  const handleDeleteMenu = async (id: number) => {
    try {
      // 삭제할 메뉴의 카테고리 찾기 (삭제 전에 미리 저장)
      const menuToDelete = menuItems.find((item) => item.menuId === id);
      const categoryToCheck = menuToDelete?.category;

      const result = await deleteMenu(id);

      if (result.success) {
        // 로컬 상태 업데이트 - 삭제된 메뉴 제거
        setMenuItems((prevItems) =>
          prevItems.filter((item) => item.menuId !== id)
        );

        // 카테고리의 마지막 메뉴가 삭제되었는지 확인하고 필요시 탭 변경
        if (categoryToCheck && activeTab !== "all") {
          const remainingInCategory = menuItems.filter(
            (item) => item.menuId !== id && item.category === categoryToCheck
          ).length;

          if (
            remainingInCategory === 0 &&
            activeTab === categoryToCheck.toLowerCase()
          ) {
            setActiveTab("all");
          }
        }
      }
    } catch (error) {
      console.error("메뉴 삭제 중 오류:", error);
    }
  };

  /**
   * 메뉴 추가 모달 열기
   */
  const handleOpenCreateNewMenuModal = () => {
    setIsModalOpen(true);
  };

  /**
   * 새 메뉴 생성 핸들러
   */
  const handleCreateMenu = async (menuData: CreateMenuRequestDto) => {
    try {
      const result = await createMenu(menuData);

      if (result.success && result.data) {
        setMenuItems((prevItems) => [
          ...prevItems,
          result.data as GetMenuResponseDto,
        ]);
      }
    } catch (error) {
      console.error("메뉴 생성 중 오류:", error);
    }
  };

  // 로딩 상태 표시
  if (isLoadingMenus) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
        <div className="text-center">
          <div className="mb-4 text-xl font-medium">
            메뉴 정보를 불러오는 중...
          </div>
          <div className="animate-pulse bg-gray-200 h-8 w-48 rounded-md mx-auto"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 표시 - menuError와 manageError 모두 처리
  if (menuError || manageError) {
    const errorMessage = menuError || manageError;

    return (
      <div className="flex flex-col items-center justify-center p-8 h-[70vh]">
        <div className="text-center">
          <div className="mb-4 text-xl font-medium text-red-500">
            메뉴 정보를 불러오는 데 실패했습니다
          </div>
          <div className="text-gray-600">{errorMessage}</div>
          <Button
            variant="primary"
            size="md"
            className="mt-6"
            onClick={() => merchantId && void fetchMenuList(merchantId)}
          >
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-8 p-6 md:p-10 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">메뉴 관리</h2>
            <p className="text-neutral-500 mt-1">
              메뉴 항목을 추가하고 관리하세요
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="md"
              variant="primary"
              rightIcon={<Plus className="h-4 w-4" />}
              onClick={handleOpenCreateNewMenuModal}
              disabled={isCreating}
            >
              메뉴 추가
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-8 pb-4">
            <h3 className="text-2xl font-bold">메뉴 목록</h3>
            <p className="text-neutral-500 text-base mt-2">
              카테고리별로 메뉴를 확인하고 관리할 수 있습니다. 현재{" "}
              {categories.length - 1}개의 카테고리가 있습니다.
            </p>
          </div>

          <div className="px-8">
            <MenuTabs
              categories={categories}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="mt-6 pb-8">
              <MenuList
                menuItems={menuItems}
                activeTab={activeTab}
                onToggleAvailability={handleToggleAvailability}
                onDuplicateMenu={handleItemCardDuplicate}
                onDeleteMenu={handleDeleteMenu}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 메뉴 추가 모달 */}
        <CreateNewMenuModal
          isOpen={isModalOpen}
          onCloseAction={() => setIsModalOpen(false)}
          onCreateMenuAction={handleCreateMenu}
        />
      </div>
    </div>
  );
}
