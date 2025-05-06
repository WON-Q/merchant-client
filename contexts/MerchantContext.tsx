import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useMerchantInfo } from "@/hooks/api/dashboard/useMerchantInfo";
import { MerchantInfoResponse } from "@/app/api/merchant/route";
import { HookResponse } from "@/types/hook";

// 컨텍스트에서 제공할 값의 타입 정의
interface MerchantContextType {
  merchantInfo: MerchantInfoResponse | null;
  isLoading: boolean;
  error: string | null;
  refetchMerchantInfo: () => Promise<HookResponse<MerchantInfoResponse>>;
}

// 컨텍스트 생성
const MerchantContext = createContext<MerchantContextType | undefined>(
  undefined
);

// 컨텍스트 프로바이더 컴포넌트
export function MerchantProvider({ children }: { children: ReactNode }) {
  // useMerchantInfo 훅을 사용하여 가맹점 정보 관련 상태 및 함수 가져오기
  const { merchantInfo, isLoading, error, fetchMerchantInfo } =
    useMerchantInfo();

  // 컴포넌트 마운트 시 자동으로 가맹점 정보 조회
  useEffect(() => {
    fetchMerchantInfo();
  }, []);

  return (
    <MerchantContext.Provider
      value={{
        merchantInfo,
        isLoading,
        error,
        refetchMerchantInfo: fetchMerchantInfo,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
}

// 컨텍스트를 사용하기 위한 훅
export function useMerchantContext() {
  const context = useContext(MerchantContext);
  if (context === undefined) {
    throw new Error(
      "useMerchantContext는 MerchantProvider 내에서 사용해야 합니다."
    );
  }
  return context;
}
