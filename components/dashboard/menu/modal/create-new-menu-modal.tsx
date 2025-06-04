"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

import {
  MenuOptionGroup,
  GetMenuResponseDto,
  CreateMenuRequestDto,
} from "@/app/api/dashboard/menu/route";
import { useMenuImageUpload } from "@/hooks/api/dashboard/menu/use-menu-image-upload";

import MenuInfoEditor from "./menu-info-editor";
import MenuOptionEditor from "./menu-option-editor";

interface CreateNewMenuModalProps {
  /**
   * 모달 상태
   */
  isOpen: boolean;

  /**
   * 모달 닫기 핸들러
   */
  onCloseAction: () => void;

  /**
   * 메뉴 생성 핸들러
   */
  onCreateMenuAction: (menuData: CreateMenuRequestDto) => Promise<void>;

  /**
   * 메뉴 수정정 핸들러
   */
  editMenuData?: GetMenuResponseDto | null;
  
  onEditMenuAction?: (menuData: GetMenuResponseDto) => void;
}

/**
 * 메뉴 생성 모달 컴포넌트
 */
export default function CreateNewMenuModal({
  isOpen,
  onCloseAction,
  onCreateMenuAction,
  editMenuData,
  onEditMenuAction,
}: CreateNewMenuModalProps) {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<"basic" | "options">("basic");

  // 메뉴 폼 상태
  const isEditMode = !!editMenuData;

  const [name, setName] = useState(editMenuData?.name || "");
  const [menuCategory, setMenuCategory] = useState(editMenuData?.category || "");
  const [menuPrice, setMenuPrice] = useState<number>(editMenuData?.price || 0);
  const [menuDescription, setMenuDescription] = useState(
    editMenuData?.description || ""
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState(editMenuData?.menuImgUrl || "");
  const [optionGroups, setOptionGroups] = useState<MenuOptionGroup[]>(editMenuData?.optionGroups || []); // ✅ 수정: editMenuData에서 옵션 그룹 초기화

  // 이미지 업로드 훅
  const { isUploading, uploadError, uploadMenuImage } = useMenuImageUpload();

  // 메뉴 저장 가능 여부
  const isSaveEnabled =
    name && menuCategory && menuPrice >= 0 && !isUploading;

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    // 변경 내용이 있으면 확인
    if (
      name ||
      menuCategory ||
      menuPrice > 0 ||
      menuDescription ||
      imageUrl ||
      optionGroups.length > 0
    ) {
      if (window.confirm("변경 사항을 저장하지 않고 나가시겠습니까?")) {
        onCloseAction();
      }
    } else {
      onCloseAction();
    }
  };

  // 메뉴 저장 핸들러
  const handleSave = async () => {
    try {
      if (isEditMode && onEditMenuAction && editMenuData) {
        const updatedMenu: GetMenuResponseDto = {
          menuId: editMenuData.menuId,
          name,
          price: menuPrice,
          description: menuDescription,
          category: menuCategory,
          isAvailable, // ✅ 상태에서 가져오기
          menuImgUrl: imageUrl,
          optionGroups, // ✅ 반드시 포함
        };

        onEditMenuAction(updatedMenu); // ✅ 프론트 상태만 업데이트
      } else {
        const menuData: CreateMenuRequestDto = {
          name,
          category: menuCategory,
          price: menuPrice,
          description: menuDescription,
          isAvailable,
          menuImgUrl: imageUrl,
          optionGroups,
        };

        await onCreateMenuAction(menuData);
      }

      onCloseAction();
    } catch (error) {
      console.error("메뉴 저장 중 오류:", error);
      alert("메뉴 저장 중 오류가 발생했습니다.");
    }
  };

  // 옵션 그룹 추가 핸들러
  const handleAddOptionGroup = () => {
    setOptionGroups([
      ...optionGroups,
      {
        groupName: `옵션 그룹 ${optionGroups.length + 1}`,
        displaySequence: optionGroups.length,
        options: [
          {
            optionName: "옵션 1",
            optionPrice: 0,
          },
        ],
      },
    ]);

    // 옵션 탭으로 전환
    setActiveTab("options");
  };

  // 옵션 그룹 삭제 핸들러
  const handleRemoveOptionGroup = (index: number) => {
    setOptionGroups(optionGroups.filter((_, i) => i !== index));
  };

  // 옵션 그룹명 변경 핸들러
  const handleOptionGroupNameChange = (index: number, name: string) => {
    const updatedGroups = [...optionGroups];
    updatedGroups[index].groupName = name;
    setOptionGroups(updatedGroups);
  };

  // 옵션 추가 핸들러
  const handleAddOption = (groupIndex: number) => {
    const updatedGroups = [...optionGroups];
    const optionCount = updatedGroups[groupIndex].options.length;

    updatedGroups[groupIndex].options.push({
      optionName: `옵션 ${optionCount + 1}`,
      optionPrice: 0,
    });

    setOptionGroups(updatedGroups);
  };

  // 옵션 삭제 핸들러
  const handleRemoveOption = (groupIndex: number, optionIndex: number) => {
    const updatedGroups = [...optionGroups];
    updatedGroups[groupIndex].options = updatedGroups[
      groupIndex
    ].options.filter((_, i) => i !== optionIndex);
    setOptionGroups(updatedGroups);
  };

  // 옵션명 변경 핸들러
  const handleOptionNameChange = (
    groupIndex: number,
    optionIndex: number,
    name: string
  ) => {
    const updatedGroups = [...optionGroups];
    updatedGroups[groupIndex].options[optionIndex].optionName = name;
    setOptionGroups(updatedGroups);
  };

  // 옵션 가격 변경 핸들러
  const handleOptionPriceChange = (
    groupIndex: number,
    optionIndex: number,
    price: number
  ) => {
    const updatedGroups = [...optionGroups];
    updatedGroups[groupIndex].options[optionIndex].optionPrice = price;
    setOptionGroups(updatedGroups);
  };

  // ⭐️ 추가: editMenuData가 변경될 때 state 초기화
  useEffect(() => {
    if (editMenuData) {
      // 수정 모드 → editMenuData로 state 채우기
      setName(editMenuData.name);
      setMenuCategory(editMenuData.category);
      setMenuPrice(editMenuData.price);
      setMenuDescription(editMenuData.description);
      setIsAvailable(editMenuData.isAvailable ?? true);
      setImageUrl(editMenuData.menuImgUrl || "");
      setOptionGroups(editMenuData.optionGroups || []);
    } else {
      // 추가 모드 → 빈 값으로 초기화
      setName("");
      setMenuCategory("");
      setMenuPrice(0);
      setMenuDescription("");
      setIsAvailable(true);
      setImageUrl("");
      setOptionGroups([]);
    }
  }, [editMenuData, isOpen]); // ⭐️ isOpen까지 넣으면 모달 열릴 때마다 깔끔하게 초기화됨

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={isEditMode ? "메뉴 수정" : "메뉴 추가"} // ✅ 동적 타이틀
      description={
        isEditMode ? "메뉴 정보를 수정합니다" : "새로운 메뉴를 추가합니다"
      } // ✅ 동적 설명
      size="2xl"
      footer={
        <>
          <Button variant="outline" onClick={handleCloseModal}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSave} // ✅ 저장 핸들러
            disabled={!isSaveEnabled}
          >
            {isEditMode ? "수정" : "추가"} {/* ✅ 동적 버튼 텍스트 */}
          </Button>
        </>
      }
    >
      {/* 직접 구현한 간단한 탭 UI */}
      <div className="mb-6">
        <div className="border border-neutral-200 rounded-lg p-1 flex bg-neutral-100">
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              activeTab === "basic"
                ? "bg-white text-[#FF6B35] shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            onClick={() => setActiveTab("basic")}
          >
            기본 정보
          </button>
          <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              activeTab === "options"
                ? "bg-white text-[#FF6B35] shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            onClick={() => setActiveTab("options")}
          >
            옵션 설정
          </button>
        </div>
      </div>

      {/* 탭 내용 */}
      {activeTab === "basic" ? (
        <MenuInfoEditor
          name={name}
          onNameChange={setName}
          category={menuCategory}
          onCategoryChange={setMenuCategory}
          price={menuPrice}
          onPriceChange={setMenuPrice}
          description={menuDescription}
          onDescriptionChange={setMenuDescription}
          isAvailable={isAvailable}
          onAvailabilityChange={setIsAvailable}
          imageUrl={imageUrl}
          onImageUrlChange={setImageUrl}
          onImageUpload={uploadMenuImage}
          isUploading={isUploading}
          uploadError={uploadError}
          onAddOptionGroup={handleAddOptionGroup}
        />
      ) : (
        <MenuOptionEditor
          optionGroups={optionGroups}
          onAddOptionGroup={handleAddOptionGroup}
          onRemoveOptionGroup={handleRemoveOptionGroup}
          onOptionGroupNameChange={handleOptionGroupNameChange}
          onAddOption={handleAddOption}
          onRemoveOption={handleRemoveOption}
          onOptionNameChange={handleOptionNameChange}
          onOptionPriceChange={handleOptionPriceChange}
        />
      )}
    </Modal>
  );
}
