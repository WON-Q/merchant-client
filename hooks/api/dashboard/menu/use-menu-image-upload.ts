import { useState } from "react";
import { HookResponse } from "@/types/hook";
import { MenuImageUploadResponseDto } from "@/app/api/dashboard/menu/image/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 메뉴 이미지를 업로드하는 커스텀 훅
 *
 * @returns 메뉴 이미지 업로드 상태와 핸들러를 포함하는 객체
 */
export function useMenuImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * 메뉴 이미지 파일을 업로드하는 함수
   *
   * @param file 업로드할 메뉴 이미지 파일
   * @returns 업로드 결과 및 이미지 URL을 포함한 프로미스
   */
  const uploadMenuImage = async (
    file: File
  ): Promise<HookResponse<MenuImageUploadResponseDto>> => {
    // 이전 상태 초기화
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    // 파일 타입 검증
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      const errorMessage = "JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.";

      setUploadError(errorMessage);
      setUploadSuccess(false);
      setIsUploading(false);

      return {
        success: false,
        errorMessage,
      };
    }

    try {
      // FormData 생성 및 파일 첨부
      const formData = new FormData();
      formData.append("file", file);

      // API 호출 (메뉴 이미지 업로드)
      const response = await fetch("/api/dashboard/menu/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse: ErrorResponse = await response.json();
        const errorMessage = errorResponse.errorMessage || "업로드 중 오류가 발생했습니다.";

        setUploadError(errorMessage);
        setUploadSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      const data: ApiResponse<MenuImageUploadResponseDto> = await response.json();

      // 이미지 URL 정보가 없는 경우
      if (data.data == null) {
        const errorMessage = "이미지 URL 정보를 받아올 수 없습니다.";

        setUploadError(errorMessage);
        setUploadSuccess(false);

        return {
          success: false,
          errorMessage,
        };
      }

      // 성공적으로 처리된 경우
      setUploadError(null);
      setUploadSuccess(true);

      return {
        success: true,
        data: data.data,
      };

    } catch (error) {
      console.error("메뉴 이미지 업로드 오류:", error);

      const errorMessage = "메뉴 이미지 업로드 중 오류가 발생했습니다.";
      setUploadError(errorMessage);
      setUploadSuccess(false);

      return {
        success: false,
        errorMessage,
      };

    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 업로드 상태 초기화하는 함수
   */
  const resetUpload = () => {
    setUploadSuccess(false);
    setUploadError(null);
  };

  return {
    isUploading,
    uploadSuccess,
    uploadError,
    uploadMenuImage,
    resetUpload,
  };
}
