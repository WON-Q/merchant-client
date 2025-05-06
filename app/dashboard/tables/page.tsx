import React from "react";

export default function TablesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* 테이블 레이아웃 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">테이블 레이아웃</h1>
        <p className="text-muted-foreground">
          테이블 배치와 상태를 관리할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
