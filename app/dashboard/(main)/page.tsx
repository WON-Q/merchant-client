import React from "react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* 대시보드 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          가맹점 데이터 및 통계를 확인할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
