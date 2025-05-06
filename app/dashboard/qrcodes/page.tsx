import React from "react";

export default function QRCodesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* QR코드 관리 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">QR코드 관리</h1>
        <p className="text-muted-foreground">
          테이블별 QR코드를 생성하고 관리할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
