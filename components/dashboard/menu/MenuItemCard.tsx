import { useState } from "react";
import Image from "next/image";
import { Copy, Edit, Trash } from "lucide-react";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { GetMenuResponseDto } from "@/app/api/dashboard/menu/route";
import { formatPrice } from "@/lib/utils";

interface MenuItemCardProps {
  /** 메뉴 아이템 데이터 */
  menu: GetMenuResponseDto;
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

export function MenuItemCard({
  menu,
  onToggleAvailability,
  onDuplicateMenu,
  onDeleteMenu,
  onEditMenu,
  isLoading,
}: MenuItemCardProps) {
  // 로컬 상태
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  // 삭제 버튼 클릭 처리
  const handleDeleteClick = async () => {
    if (confirmDelete) {
      // 확인 상태일 때 실제 삭제 실행
      setLocalLoading(true);
      try {
        await onDeleteMenu(menu.menuId);
      } catch (error) {
        console.error("메뉴 삭제 중 오류:", error);
      } finally {
        setLocalLoading(false);
        setConfirmDelete(false);
      }
    } else {
      // 첫 클릭 시 확인 상태로 전환
      setConfirmDelete(true);
      // 5초 후 확인 상태 리셋
      setTimeout(() => setConfirmDelete(false), 5000);
    }
  };

  // 메뉴 품절 상태 토글 처리
  const handleToggleAvailability = async () => {
    setLocalLoading(true);
    try {
      await onToggleAvailability(menu.menuId, !menu.isAvailable);
    } catch (error) {
      console.error("품절 상태 변경 중 오류:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  // 메뉴 복제 처리
  const handleDuplicateMenu = async () => {
    setLocalLoading(true);
    try {
      await onDuplicateMenu(menu.menuId);
    } catch (error) {
      console.error("메뉴 복제 중 오류:", error);
    } finally {
      setLocalLoading(false);
    }
  };

  const imageUrl = menu.menuImgUrl || "/images/next.svg";
  const isDisabled = isLoading || localLoading;

  return (
    <div
      className={`relative bg-white rounded-lg shadow border ${
        !menu.isAvailable
          ? "border-neutral-200 opacity-75"
          : "border-neutral-200"
      }`}
    >
      {/* 메뉴 이미지 */}
      <div className="relative overflow-hidden h-[150px] rounded-t-lg">
        <div className="absolute inset-0 bg-neutral-200" />
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={menu.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-500">
            이미지를 불러올 수 없습니다
          </div>
        )}
        {!menu.isAvailable && (
          <div className="absolute top-0 right-0 px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-bl-lg">
            품절
          </div>
        )}
      </div>

      {/* 메뉴 정보 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-lg line-clamp-1">{menu.name}</h3>
          <div className="flex items-center">
            <Switch
              size="sm"
              checked={menu.isAvailable}
              onCheckedChange={handleToggleAvailability}
              disabled={isDisabled}
            />
          </div>
        </div>

        <div className="text-lg font-semibold text-[#FF6B35] mb-3">
          {formatPrice(menu.price)}
        </div>

        <p className="text-neutral-600 text-sm line-clamp-2 min-h-[40px]">
          {menu.description}
        </p>
      </div>

      {/* 작업 버튼 */}
      <div className="flex justify-center p-3">
        {confirmDelete ? (
          <Button
            variant="error"
            size="sm"
            onClick={handleDeleteClick}
            className="max-w-[200px]"
            disabled={isDisabled}
          >
            정말 삭제하시겠습니까?
          </Button>
        ) : (
          <div className="flex gap-2 justify-center">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => onEditMenu && onEditMenu(menu)}
              disabled={isDisabled}
            >
              수정
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Copy className="h-4 w-4" />}
              onClick={handleDuplicateMenu}
              disabled={isDisabled}
              className="hover:bg-neutral-100"
            >
              복제
            </Button>
            <Button
              variant="error"
              size="sm"
              leftIcon={<Trash className="h-4 w-4" />}
              onClick={handleDeleteClick}
              disabled={isDisabled}
              className="border-transparent hover:border-transparent"
            >
              삭제
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
