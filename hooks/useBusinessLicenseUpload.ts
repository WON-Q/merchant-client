import { useState } from "react";
import { HookResponse } from "@/types/hook";
import { BusinessRegistrationOcrResponseDto } from "@/app/api/auth/signup/business-license/route";
import { ApiResponse, ErrorResponse } from "@/types/api";

/**
 * 사업자 등록증 파일을 업로드하는 커스텀 훅
 *
 * @returns 사업자 등록증 업로드 상태와 핸들러를 포함하는 객체
 */
export function useBusinessLicenseUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  /**
   * 사업자 등록증 파일을 업로드하고 등록번호를 추출하는 함수
   *
   * @param file 업로드할 사업자 등록증 파일
   * @returns 업로드 결과 및 사업자 등록번호를 포함한 프로미스
   */
  const uploadBusinessLicense = async (
      file: File
  ): Promise<HookResponse<BusinessRegistrationOcrResponseDto>> => {
    // 이전 상태 초기화
    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    // 파일 타입 검증
    const validTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      const errorMessage = "PDF, JPG, PNG 파일만 업로드 가능합니다.";

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

      // API 호출 (사업자 등록증 OCR 처리)
      const response = await fetch("/api/auth/signup/business-license", {
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

      const data: ApiResponse<BusinessRegistrationOcrResponseDto> = await response.json();

      // 사업자 등록증 정보가 없는 경우
      if (data.data == null) {
        const errorMessage = "사업자 등록증 정보를 추출할 수 없습니다.";

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
      console.error("사업자 등록증 업로드 오류:", error);

      const errorMessage = "사업자 등록증 업로드 중 오류가 발생했습니다.";
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
    uploadBusinessLicense,
    resetUpload,
  };
}
