"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MerchantInfo } from "@/components/dashboard/settings/merchant-info";
import { AccountInfo } from "@/components/dashboard/settings/account-info";
import { MerchantInfoUpdateRequest } from "@/app/api/merchant/route";
import { useMerchantInfo } from "@/hooks/api/dashboard/use-merchant-info";

/**
 * 가맹점 정보 설정 페이지
 */
export default function SettingsPage() {
  // 설정 저장 상태 관리
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // useMerchantInfo 훅 사용
  const { merchantInfo, isLoading, fetchMerchantInfo } = useMerchantInfo();

  // 수정된 정보를 별도로 관리
  const [updatedInfo, setUpdatedInfo] = useState<MerchantInfoUpdateRequest>({});

  // 초기 데이터 로딩
  useEffect(() => {
    fetchMerchantInfo();
  }, []);

  // merchantInfo가 로드되면 updatedInfo 초기화
  useEffect(() => {
    if (merchantInfo && Object.keys(updatedInfo).length === 0) {
      setUpdatedInfo({
        merchantOwnerPhoneNo: merchantInfo.merchantOwnerPhoneNo || "",
        description: merchantInfo.description || "",
        merchantAccountBankName: merchantInfo.merchantAccountBankName || "",
        merchantAccount: merchantInfo.merchantAccount || "",
        merchantAccountHolderName: merchantInfo.merchantAccountHolderName || "",
      });
    }
  }, [merchantInfo]);

  /**
   * 가맹점 정보 저장 함수
   */
  const saveMerchantInfo = async () => {
    try {
      setIsSaving(true);

      // 변경사항 여부 체크 - 원래 값과 비교하여 실제 변경된 것만 전송
      const actualChanges: MerchantInfoUpdateRequest = {};

      if (merchantInfo) {
        if (
          updatedInfo.merchantOwnerPhoneNo !== merchantInfo.merchantOwnerPhoneNo
        )
          actualChanges.merchantOwnerPhoneNo = updatedInfo.merchantOwnerPhoneNo;

        if (updatedInfo.description !== merchantInfo.description)
          actualChanges.description = updatedInfo.description;

        if (
          updatedInfo.merchantAccountBankName !==
          merchantInfo.merchantAccountBankName
        )
          actualChanges.merchantAccountBankName =
            updatedInfo.merchantAccountBankName;

        if (updatedInfo.merchantAccount !== merchantInfo.merchantAccount)
          actualChanges.merchantAccount = updatedInfo.merchantAccount;

        if (
          updatedInfo.merchantAccountHolderName !==
          merchantInfo.merchantAccountHolderName
        )
          actualChanges.merchantAccountHolderName =
            updatedInfo.merchantAccountHolderName;
      }

      if (Object.keys(actualChanges).length === 0) {
        console.log("변경된 정보가 없습니다");
        setIsSaving(false);
        return;
      }

      console.log("저장할 데이터:", actualChanges);

      // API 호출
      const response = await fetch("/api/merchant", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actualChanges),
      });

      const data = await response.json();
      console.log("API 응답 데이터:", data);

      if (data.success) {
        console.log("가맹점 정보가 성공적으로 저장되었습니다");
        // 최신 정보로 업데이트를 위해 다시 조회
        await fetchMerchantInfo();
        // 수정 정보 초기화 - 새로운 merchantInfo 기준으로 초기화
        if (merchantInfo) {
          setUpdatedInfo({
            merchantOwnerPhoneNo: data.data.merchantOwnerPhoneNo || "",
            description: data.data.description || "",
            merchantAccountBankName: data.data.merchantAccountBankName || "",
            merchantAccount: data.data.merchantAccount || "",
            merchantAccountHolderName:
              data.data.merchantAccountHolderName || "",
          });
        }
      } else {
        console.error("정보 저장 실패:", data.message);
      }
    } catch (error) {
      console.error("가맹점 정보 업데이트 중 오류:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setUpdatedInfo((prev) => ({ ...prev, merchantOwnerPhoneNo: value }));
  };

  const handleDescriptionChange = (value: string) => {
    setUpdatedInfo((prev) => ({ ...prev, description: value }));
  };

  const handleBankNameChange = (value: string) => {
    setUpdatedInfo((prev) => ({ ...prev, merchantAccountBankName: value }));
  };

  const handleAccountNumberChange = (value: string) => {
    setUpdatedInfo((prev) => ({ ...prev, merchantAccount: value }));
  };

  const handleAccountHolderNameChange = (value: string) => {
    setUpdatedInfo((prev) => ({ ...prev, merchantAccountHolderName: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto"></div>
          <p className="mt-4 text-neutral-600">가맹점 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-8 p-6 md:p-10 pt-8">
        {/* 헤더 - 메뉴 페이지와 일관된 디자인 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">설정</h2>
            <p className="text-neutral-500 mt-1">
              매장 정보와 운영 설정을 관리하세요
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="md"
              onClick={saveMerchantInfo}
              isLoading={isSaving}
              loadingText="저장 중..."
              leftIcon={<Save className="h-4 w-4" />}
            >
              변경사항 저장
            </Button>
          </div>
        </div>

        {/* 설정 컨텐츠 - 메뉴 페이지와 일관된 디자인 */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-8 pb-4">
            <h3 className="text-2xl font-bold">가맹점 정보</h3>
            <p className="text-neutral-500 text-base mt-2">
              가맹점 정보와 계좌 정보를 관리합니다. 일부 정보는 변경할 수
              없습니다.
            </p>
          </div>

          <div className="px-8 pb-8">
            {merchantInfo && (
              <div className="space-y-6 mt-6">
                <MerchantInfo
                  merchantInfo={merchantInfo}
                  phoneNo={updatedInfo.merchantOwnerPhoneNo ?? ""}
                  description={updatedInfo.description ?? ""}
                  onPhoneChange={handlePhoneChange}
                  onDescriptionChange={handleDescriptionChange}
                />
                <AccountInfo
                  bankName={updatedInfo.merchantAccountBankName ?? ""}
                  accountNumber={updatedInfo.merchantAccount ?? ""}
                  accountHolderName={
                    updatedInfo.merchantAccountHolderName ?? ""
                  }
                  onBankNameChange={handleBankNameChange}
                  onAccountNumberChange={handleAccountNumberChange}
                  onAccountHolderNameChange={handleAccountHolderNameChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
