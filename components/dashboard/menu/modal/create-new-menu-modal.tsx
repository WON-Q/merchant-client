"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  MenuOptionGroup,
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
}

/**
 * 메뉴 생성 모달 컴포넌트
 */
export default function CreateNewMenuModal({
  isOpen,
  onCloseAction,
  onCreateMenuAction,
}: CreateNewMenuModalProps) {
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<"basic" | "options">("basic");

  // 메뉴 폼 상태
  const [menuName, setMenuName] = useState("");
  const [menuCategory, setMenuCategory] = useState("");
  const [menuPrice, setMenuPrice] = useState<number>(0);
  const [menuDescription, setMenuDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [optionGroups, setOptionGroups] = useState<MenuOptionGroup[]>([]);

  // 이미지 업로드 훅
  const { isUploading, uploadError, uploadMenuImage } = useMenuImageUpload();

  // 메뉴 저장 가능 여부
  const isSaveEnabled =
    menuName && menuCategory && menuPrice >= 0 && !isUploading;

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    // 변경 내용이 있으면 확인
    if (
      menuName ||
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
  const handleSaveMenu = async () => {
    try {
      const menuData: CreateMenuRequestDto = {
        name: menuName,
        category: menuCategory,
        price: menuPrice,
        description: menuDescription,
        isAvailable,
        menuImgUrl: imageUrl,
        optionGroups,
      };

      await onCreateMenuAction(menuData);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="메뉴 추가"
      description="새로운 메뉴를 추가합니다"
      size="2xl"
      footer={
        <>
          <Button variant="outline" onClick={handleCloseModal}>
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveMenu}
            disabled={!isSaveEnabled}
          >
            추가
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
          name={menuName}
          onNameChange={setMenuName}
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
