import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { HookResponse } from "@/types/hook";
import { MenuImageUploadResponseDto } from "@/app/api/dashboard/menu/image/route";

/**
 * 기본 정보 에디터 컴포넌트의 props 인터페이스
 */
interface BasicInfoEditorProps {
  /**
   * 메뉴명
   */
  name: string;

  /**
   * 메뉴명 변경 핸들러
   */
  onNameChange: (value: string) => void;

  /**
   * 메뉴 카테고리
   */
  category: string;

  /**
   * 카테고리 변경 핸들러
   */
  onCategoryChange: (value: string) => void;

  /**
   * 메뉴 가격
   */
  price: number;

  /**
   * 가격 변경 핸들러
   */
  onPriceChange: (value: number) => void;

  /**
   * 메뉴 설명
   */
  description: string;

  /**
   * 설명 변경 핸들러
   */
  onDescriptionChange: (value: string) => void;

  /**
   * 메뉴 판매 가능 여부
   */
  isAvailable: boolean;

  /**
   * 판매 가능 여부 변경 핸들러
   */
  onAvailabilityChange: (value: boolean) => void;

  /**
   * 메뉴 이미지 URL
   */
  imageUrl: string;

  /**
   * 이미지 URL 변경 핸들러
   */
  onImageUrlChange: (value: string) => void;

  /**
   * 이미지 업로드 핸들러
   */
  onImageUpload?: (
    file: File
  ) => Promise<HookResponse<MenuImageUploadResponseDto>>;

  /**
   * 이미지 업로드 로딩 상태
   */
  isUploading?: boolean;

  /**
   * 이미지 업로드 에러
   */
  uploadError?: string | null;

  /**
   * 옵션 그룹 추가 핸들러
   */
  onAddOptionGroup?: () => void;
}

/**
 * 메뉴 기본 정보 편집 컴포넌트
 */
export default function MenuInfoEditor({
  name,
  onNameChange,
  category,
  onCategoryChange,
  price,
  onPriceChange,
  description,
  onDescriptionChange,
  isAvailable,
  onAvailabilityChange,
  imageUrl,
  onImageUrlChange,
  onImageUpload,
  isUploading = false,
  uploadError = null,
}: BasicInfoEditorProps) {
  const form = useForm();

  // 이미지 오류 상태
  const [imageError, setImageError] = useState(false);

  // 파일 입력 참조
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 다이얼로그 표시
  const handleSelectImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 업로드 처리
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    const result = await onImageUpload(file);

    if (result.success && result.data) {
      onImageUrlChange(result.data.imageUrl);
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    onImageUrlChange("");
    setImageError(false);
  };

  return (
    <div className="space-y-6">
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 왼쪽: 이미지 영역 */}
        <div className="space-y-4">
          <div className="block text-sm font-medium text-gray-700">
            메뉴 이미지
          </div>
          {!imageUrl ? (
            <div
              className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-full min-h-[320px] max-h-[320px] cursor-pointer hover:bg-neutral-50"
              onClick={handleSelectImage}
            >
              <ImageIcon className="h-10 w-10 text-neutral-400 mb-3" />
              <div className="text-sm text-neutral-500 text-center mb-3">
                이미지를 드래그하여 업로드하거나
                <br />
                클릭하여 파일을 선택하세요
              </div>
              <Button variant="outline" className="h-9 px-4 min-w-[100px]">
                이미지 선택
              </Button>
              {uploadError && (
                <p className="text-red-500 text-xs mt-2">{uploadError}</p>
              )}
              {isUploading && (
                <div className="mt-2 text-sm text-neutral-500">
                  이미지 업로드 중...
                </div>
              )}
            </div>
          ) : (
            <div className="border rounded-lg p-4 h-full min-h-[320px] max-h-[320px] flex flex-col">
              <div className="flex-1 relative w-full mb-3 bg-neutral-100 rounded-md overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={name || "메뉴 이미지"}
                  fill
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                    <p className="text-sm text-neutral-500">
                      이미지를 불러올 수 없습니다
                    </p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectImage}
                  disabled={isUploading}
                  className="h-9 px-4 min-w-[100px]"
                >
                  이미지 변경
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                  disabled={isUploading}
                  className="h-9 px-4 min-w-[100px] text-red-500 hover:text-red-600"
                >
                  이미지 삭제
                </Button>
              </div>
              {uploadError && (
                <p className="text-red-500 text-xs mt-2">{uploadError}</p>
              )}
              {isUploading && (
                <div className="mt-2 text-center text-sm text-neutral-500">
                  업로드 중...
                </div>
              )}
            </div>
          )}
        </div>

        {/* 오른쪽: 메뉴 정보 입력 영역 */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="block text-sm font-medium text-gray-700">
              메뉴명
              <span className="text-[#EF4444] ml-1">*</span>
            </div>
            <Input
              id="menuName"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="메뉴 이름 입력"
              isRequired
              isError={!name}
              errorMessage={!name ? "메뉴명은 필수 입력 항목입니다" : undefined}
            />
          </div>

          <div className="space-y-2">
            <div className="block text-sm font-medium text-gray-700">
              카테고리
              <span className="text-[#EF4444] ml-1">*</span>
            </div>
            <Input
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="카테고리 입력"
              isError={!category}
              errorMessage={
                !category ? "카테고리는 필수 입력 항목입니다" : undefined
              }
            />
          </div>

          <div className="space-y-2">
            <div className="block text-sm font-medium text-gray-700">
              가격
              <span className="text-[#EF4444] ml-1">*</span>
            </div>
            <Input
              id="menuPrice"
              type="number"
              value={price || ""}
              onChange={(e) => onPriceChange(parseInt(e.target.value) || 0)}
              placeholder="0"
              rightIcon={<span className="text-sm text-neutral-500">원</span>}
              isRequired
              isError={price < 0}
              errorMessage={
                price < 0 ? "가격은 0 이상이어야 합니다" : undefined
              }
            />
          </div>

          <div className="space-y-2">
            <div className="block text-sm font-medium text-gray-700">
              판매 상태
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Switch
                id="menuAvailability"
                checked={isAvailable}
                onCheckedChange={onAvailabilityChange}
              />
              <span>{isAvailable ? "판매 중" : "품절"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="block text-sm font-medium text-gray-700">메뉴 설명</div>
        <textarea
          {...form.register("description")}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="메뉴에 대한 설명을 입력하세요"
          className="w-full px-4 py-2 border border-[#D2D9E0] focus:border-[#FF6B35] focus:ring-[#FF6B35] rounded-lg shadow-sm min-h-[150px] focus:outline-none focus:ring-1"
          rows={4}
        />
      </div>
    </div>
  );
}
