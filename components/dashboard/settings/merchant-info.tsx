import React from "react";
import { Input } from "@/components/ui/input";
import { MerchantInfoResponse } from "@/app/api/merchant/route";

interface MerchantInfoProps {
  merchantInfo: MerchantInfoResponse;
  phoneNo: string;
  description: string;
  onPhoneChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

/**
 * 가맹점 기본 정보 설정 컴포넌트
 */
export function MerchantInfo({
  merchantInfo,
  phoneNo,
  description,
  onPhoneChange,
  onDescriptionChange,
}: MerchantInfoProps) {
  return (
    <div className="bg-white shadow-sm border border-neutral-200 rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">기본 정보</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Input
            label="가맹점 이름"
            value={merchantInfo.merchantName}
            disabled
          />

          <Input
            label="사업자 등록 번호"
            value={merchantInfo.businessRegistrationNo}
            disabled
          />

          <Input
            label="대표자 이름"
            value={merchantInfo.merchantOwnerName}
            disabled
          />

          <Input
            label="대표자 전화번호"
            value={phoneNo}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="전화번호를 입력해주세요"
          />

          <Input
            label="가맹점 주소"
            value={merchantInfo.merchantAddress}
            disabled
          />

          <div className="md:col-span-2">
            <Input
              label="가맹점 설명"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="가맹점 설명을 입력해주세요"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
