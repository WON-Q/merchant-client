import React from "react";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* 주문 관리 제목 */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">주문 관리</h1>
        <p className="text-muted-foreground">
          주문 정보를 관리하고 처리할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
