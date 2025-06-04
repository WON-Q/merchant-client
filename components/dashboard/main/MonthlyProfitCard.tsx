import React from "react";
import DashboardCard from "./DashboardCard";

export default function MonthlyProfitCard({ className }: { className?: string }) {
  return (
    <DashboardCard className={`flex flex-col gap-1 py-3 px-4 ${className}`}>
      <div className="text-base font-bold text-gray-900">11월 손익</div>
      <div className="text-2xl font-bold text-blue-600">+ 14,101,942원</div>

      <div className="flex justify-between text-sm mt-2">
        <span>매출</span>
        <span>14,338,150원</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>비용</span>
        <span>236,208원</span>
      </div>
    </DashboardCard>
  );
}
