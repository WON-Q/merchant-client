import React from "react";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { DropdownMenuItem } from "@/components/ui/DropdownMenuItem";
import { KOREAN_BANKS } from "@/constants/banks";

interface AccountInfoProps {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  onBankNameChange: (value: string) => void;
  onAccountNumberChange: (value: string) => void;
  onAccountHolderNameChange: (value: string) => void;
}

/**
 * 가맹점 계좌 정보 설정 컴포넌트
 */
export function AccountInfo({
  bankName,
  accountNumber,
  accountHolderName,
  onBankNameChange,
  onAccountNumberChange,
  onAccountHolderNameChange,
}: AccountInfoProps) {
  // bank label/value 관리
  const bankLabelForValue =
    KOREAN_BANKS.find((bank) => bank.value === bankName)?.label || bankName;

  return (
    <div className="bg-white shadow-sm border border-neutral-200 rounded-xl">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">계좌 정보</h3>
        <p className="text-sm text-neutral-500 mb-4">
          정산 받을 계좌 정보를 입력해주세요. 모든 계좌 정보는 입력해야 합니다.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* 은행명 드롭다운 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              은행명
            </label>
            <Dropdown
              value={bankLabelForValue}
              onChange={onBankNameChange}
              placeholder="은행을 선택하세요"
            >
              {KOREAN_BANKS.map((bank) => (
                <DropdownMenuItem key={bank.value} value={bank.label}>
                  {bank.label}
                </DropdownMenuItem>
              ))}
            </Dropdown>
          </div>

          {/* 계좌번호 입력 필드 */}
          <Input
            label="계좌번호"
            value={accountNumber || ""}
            onChange={(e) => onAccountNumberChange(e.target.value)}
            placeholder="계좌번호를 입력해주세요 (예: 123-456-78901234)"
          />

          {/* 예금주명 입력 필드 */}
          <Input
            label="예금주명"
            value={accountHolderName || ""}
            onChange={(e) => onAccountHolderNameChange(e.target.value)}
            placeholder="예금주명을 입력해주세요"
          />
        </div>
      </div>
    </div>
  );
}
