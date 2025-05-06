import React from "react";

export default function MenuPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* 메뉴 관리 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">메뉴 관리</h1>
        <p className="text-muted-foreground">
          메뉴 항목을 추가, 수정, 삭제할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
