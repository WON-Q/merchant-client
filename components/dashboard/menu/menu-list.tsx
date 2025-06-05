import { useState, useEffect, useMemo } from "react";
import { MenuItemCard } from "./menu-item-card";
import { Pagination } from "@/components/ui/pagination";
import { GetMenuResponseDto } from "@/app/api/dashboard/menu/route";

interface MenuListProps {
  /** 메뉴 아이템 목록 */
  menuItems: GetMenuResponseDto[];
  /** 현재 선택된 카테고리 탭 */
  activeTab: string;
  /** 메뉴 품절 상태 토글 핸들러 */
  onToggleAvailability: (id: number, isAvailable: boolean) => Promise<void>;
  /** 메뉴 복제 핸들러 */
  onDuplicateMenu: (id: number) => Promise<void>;
  /** 메뉴 삭제 핸들러 */
  onDeleteMenu: (id: number) => Promise<void>;
  /** 메뉴 수정 핸들러 */
  onEditMenu?: (menu: GetMenuResponseDto) => void;
  /** 로딩 상태 */
  isLoading: boolean;
}

export function MenuList({
  menuItems,
  activeTab,
  onToggleAvailability,
  onDuplicateMenu,
  onDeleteMenu,
  onEditMenu,
  isLoading,
}: MenuListProps) {
  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3x2 그리드

  // 카테고리 필터링 및 정렬
const filteredMenuItems = useMemo(() => {
  let items;

  if (activeTab === "all") {
    items = menuItems;
  } else {
    items = menuItems.filter(
      (item) => item.category && item.category.toLowerCase() === activeTab
    );
  }

  // 메뉴 ID 순 정렬
  return [...items].sort((a, b) => a.menuId - b.menuId);
}, [menuItems, activeTab]);
  // 페이지 변경 시 현재 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // 페이지네이션을 위한 아이템 분할
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredMenuItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredMenuItems, currentPage, itemsPerPage]);

  // 전체 페이지 수 계산
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMenuItems.length / itemsPerPage)
  );

  // 페이지 변경 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      {filteredMenuItems.length === 0 ? (
        <div className="py-10 text-center text-neutral-500">
          {activeTab === "all"
            ? "메뉴가 없습니다. 메뉴 추가 버튼을 클릭하여 새 메뉴를 추가하세요."
            : "이 카테고리에 메뉴가 없습니다."}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedItems.map((menu) => (
              <MenuItemCard
                key={menu.menuId}
                menu={menu}
                onEditMenu={onEditMenu}
                onToggleAvailability={onToggleAvailability}
                onDuplicateMenu={onDuplicateMenu}
                onDeleteMenu={onDeleteMenu}
                isLoading={isLoading}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                size="md"
                variant="primary"
                showFirstLast={true}
                siblingCount={1}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
